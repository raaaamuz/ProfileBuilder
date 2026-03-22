from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes as drf_permission_classes
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from .models import CareerEntry, CareerDesignSettings, Skill, SkillsDesignSettings
from .serializers import CareerEntrySerializer, CareerDesignSettingsSerializer, SkillSerializer, SkillsDesignSettingsSerializer
import openai
import os

# Load API key from environment variable
openai.api_key = os.environ.get("OPENAI_API_KEY")

@action(detail=False, methods=["GET"], url_path="get_skills", permission_classes=[permissions.IsAuthenticated])
def get_ai_skills(prompt):
    # Adjust parameters as needed.
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": (
                    "Extract and list the key skills from the provided career descriptions. "
                    "Return the result as a comma-separated list. Do not include skills that are already "
                    "present in the exclusion list provided in the prompt."
                )
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens=150,
    )
    # Extract the AI response text
    skills_text = response['choices'][0]['message']['content']
    # Convert the comma-separated string into a list of skills
    skills_list = [skill.strip() for skill in skills_text.split(',') if skill.strip()]
    return skills_list


class PublicReadPermission(permissions.BasePermission):
    """
    Custom permission to allow public access for GET requests while requiring authentication for others.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:  # Allows GET, HEAD, OPTIONS
            return True
        return request.user and request.user.is_authenticated


class CareerEntryViewSet(viewsets.ModelViewSet):
    serializer_class = CareerEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return only the logged-in user's career entries"""
        if self.request.user.is_authenticated:
            return CareerEntry.objects.filter(user=self.request.user)
        return CareerEntry.objects.none()

    def list(self, request, *args, **kwargs):
        """Return career entries along with user settings using camelCase keys"""
        user = request.user
        career_entries = CareerEntry.objects.filter(user=user)
        entries_data = CareerEntrySerializer(career_entries, many=True).data

        # Fetch user settings
        design_settings = CareerDesignSettings.objects.filter(user=user).first()
        design_data = CareerDesignSettingsSerializer(design_settings).data if design_settings else None

        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
            "careerEntries": entries_data,
            "designSettings": design_data or {"message": "No design settings found."},
        })

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["GET"], url_path="get_skills", permission_classes=[permissions.IsAuthenticated])
    def get_skills(self, request):
        """
        Fetch user skills. If the user already has skills in the database, return them.
        Otherwise, extract skills via AI from the user's career descriptions.
        """
        user = request.user

        # First, check if the user already has skills stored
        existing_skills = list(Skill.objects.filter(user=user).values_list('name', flat=True))
        if existing_skills:
            return Response({"skills": existing_skills})
        
        # Otherwise, if no skills exist, extract from career entries
        career_entries = CareerEntry.objects.filter(user=user)
        descriptions = [entry.description for entry in career_entries if entry.description]
        if not descriptions:
            return Response({"error": "No career descriptions found."}, status=status.HTTP_404_NOT_FOUND)
        combined_text = " ".join(descriptions)
        
        prompt_text = (
            f"{combined_text}\n\n"
            f"Please extract and list the key skills from the above career descriptions. "
            f"Return the result as a comma-separated list."
        )
        
        try:
            skills = get_ai_skills(prompt_text)
        except Exception as e:
            return Response({"error": f"AI service error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({"skills": skills})

    @action(detail=False, methods=["GET"], url_path="public/(?P<username>[^/.]+)", permission_classes=[permissions.AllowAny])
    def public_profile(self, request, username=None):
        """Fetch public career entries of a specific user by username using camelCase keys"""
        try:
            user = User.objects.get(username=username)
            entries = CareerEntry.objects.filter(user=user, public_profile=True)
            if not entries.exists():
                return Response({"error": "Public profile not found or private."}, status=status.HTTP_404_NOT_FOUND)
            return Response({"careerEntries": CareerEntrySerializer(entries, many=True).data})
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=["POST"], permission_classes=[permissions.IsAuthenticated])
    def toggle_public(self, request):
        """Toggle career profile visibility using proper casing in the response"""
        public = request.data.get("public_profile", False)
        CareerEntry.objects.filter(user=request.user).update(public_profile=public)
        return Response({"message": f"Profile visibility set to {public}"})

    @action(detail=False, methods=["DELETE"], permission_classes=[permissions.IsAuthenticated])
    def clear_entries(self, request):
        """Delete all career entries for the user and return response with camelCase key"""
        CareerEntry.objects.filter(user=request.user).delete()
        return Response({"message": "All career entries deleted."}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["DELETE"], url_path='delete_entry', permission_classes=[permissions.IsAuthenticated])
    def delete_entry(self, request, pk=None):
        """Delete a specific career entry by ID using proper casing in the response"""
        try:
            entry = CareerEntry.objects.get(pk=pk, user=request.user)
            entry.delete()
            return Response({"message": "Career entry deleted."}, status=status.HTTP_204_NO_CONTENT)
        except CareerEntry.DoesNotExist:
            return Response({"error": "Career entry not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["PUT"], url_path='update_entry', permission_classes=[permissions.IsAuthenticated])
    def update_entry(self, request, pk=None):
        """Update a specific career entry by ID and return updated data with camelCase keys"""
        try:
            entry = CareerEntry.objects.get(pk=pk, user=request.user)
            serializer = CareerEntrySerializer(entry, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CareerEntry.DoesNotExist:
            return Response({"error": "Career entry not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=["POST"], permission_classes=[permissions.IsAuthenticated])
    def bulk_create(self, request):
        """Allows users to save multiple career entries at once with camelCase response keys"""
        user = request.user
        career_entries = request.data.get("career_entries", [])

        if not career_entries:
            return Response({"error": "No data provided"}, status=status.HTTP_400_BAD_REQUEST)

        created_entries = []
        for entry in career_entries:
            entry["user"] = user.id  # Assign user
            serializer = CareerEntrySerializer(data=entry)
            if serializer.is_valid():
                serializer.save(user=user)
                created_entries.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "message": "Career entries saved successfully",
            "data": created_entries
        }, status=status.HTTP_201_CREATED)


from rest_framework.decorators import api_view, permission_classes as perm_classes

@api_view(['PUT'])
@perm_classes([permissions.IsAuthenticated])
def reorder_career(request):
    """Reorder career entries"""
    reordered_data = request.data.get('reorderedData', [])

    for index, item in enumerate(reordered_data):
        try:
            entry = CareerEntry.objects.get(id=item.get('id'), user=request.user)
            entry.order = index
            entry.save()
        except CareerEntry.DoesNotExist:
            continue

    return Response({"message": "Order updated successfully"})


class CareerDesignSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = CareerDesignSettingsSerializer
    permission_classes = [PublicReadPermission]  # Public GET access, Auth required for others

    def get_queryset(self):
        """Only return settings for the logged-in user"""
        if self.request.user.is_authenticated:
            return CareerDesignSettings.objects.filter(user=self.request.user)
        return CareerDesignSettings.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if CareerDesignSettings.objects.filter(user=user).exists():
            raise ValidationError("Design settings for this user already exist.")
        serializer.save(user=user)

    def create(self, request, *args, **kwargs):
        user = request.user
        instance = CareerDesignSettings.objects.filter(user=user).first()
        if instance:
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        return super().create(request, *args, **kwargs)

    @action(detail=False, methods=["GET"], permission_classes=[permissions.AllowAny])
    def get_user_settings(self, request):
        settings = CareerDesignSettings.objects.filter(user=request.user).first()
        if settings:
            return Response(CareerDesignSettingsSerializer(settings).data)
        return Response({"message": "No design settings found."}, status=status.HTTP_404_NOT_FOUND)


class SkillViewSet(viewsets.ModelViewSet):
    """
    A viewset for creating, listing, updating, and deleting skills along with their proficiency levels.
    """
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter skills for the logged-in user.
        qs = Skill.objects.filter(user=self.request.user)
        # Remove duplicates by returning only one skill per name (case insensitive).
        unique_ids = []
        seen = set()
        for skill in qs:
            name_lower = skill.name.lower().strip()
            if name_lower not in seen:
                seen.add(name_lower)
                unique_ids.append(skill.id)
        return qs.filter(id__in=unique_ids)

    def list(self, request, *args, **kwargs):
        """
        If the user already has skills saved, return them.
        Otherwise, attempt to generate skills via AI from the user's career entries.
        """
        queryset = self.get_queryset()
        if queryset.exists():
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        else:
            # No skills found in the database—attempt to generate from career entries.
            from .models import CareerEntry  # Import here to avoid circular dependency issues
            career_entries = CareerEntry.objects.filter(user=request.user)
            descriptions = [entry.description for entry in career_entries if entry.description]
            if not descriptions:
                return Response(
                    {"error": "No career descriptions found to generate skills."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            combined_text = " ".join(descriptions)
            prompt_text = (
                f"{combined_text}\n\n"
                "Please extract and list the key skills from the above career descriptions. "
                "Return the result as a comma-separated list."
            )
            try:
                ai_skills = get_ai_skills(prompt_text)
            except Exception as e:
                return Response(
                    {"error": f"AI service error: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            return Response({"skills": ai_skills})

    def perform_create(self, serializer):
        # Automatically set the user field to the logged-in user.
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['POST'], url_path='bulk_create')
    def bulk_create(self, request):
        skills_data = request.data.get("skills", [])

        # Get the list of skill names being submitted (lowercase for comparison)
        submitted_skill_names = [skill.get("name", "").strip().lower() for skill in skills_data]

        # Delete skills that are not in the submitted list
        existing_skills = Skill.objects.filter(user=request.user)
        for existing_skill in existing_skills:
            if existing_skill.name.lower() not in submitted_skill_names:
                existing_skill.delete()

        if not skills_data:
            return Response({"message": "All skills cleared."}, status=status.HTTP_200_OK)

        processed_skills = []
        for skill in skills_data:
            skill_name = skill.get("name", "").strip()
            proficiency = skill.get("proficiency", 50)
            category = skill.get("category", "other")
            # Check if the skill exists (ignoring case)
            existing_skill = Skill.objects.filter(user=request.user, name__iexact=skill_name).first()
            if existing_skill:
                # If the skill exists, update its proficiency and category
                existing_skill.proficiency = proficiency
                existing_skill.category = category
                existing_skill.save()
                processed_skills.append({"action": "updated", "data": SkillSerializer(existing_skill).data})
            else:
                serializer = SkillSerializer(data=skill)
                if serializer.is_valid():
                    serializer.save(user=request.user)
                    processed_skills.append({"action": "created", "data": serializer.data})
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {"message": "Skills processed successfully", "data": processed_skills},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=['DELETE'], url_path='delete_by_name')
    def delete_by_name(self, request):
        skill_name = request.data.get("name", "").strip()
        if not skill_name:
            return Response({"error": "No skill name provided."}, status=status.HTTP_400_BAD_REQUEST)

        deleted_count, _ = Skill.objects.filter(user=request.user, name__iexact=skill_name).delete()
        if deleted_count > 0:
            return Response({"message": f"Skill '{skill_name}' deleted successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Skill not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['POST'], url_path='update_skill')
    def update_skill(self, request):
        skill_name = request.data.get("name", "").strip()
        proficiency = request.data.get("proficiency", 50)
        category = request.data.get("category", "other")
        description = request.data.get("description", "")

        if not skill_name:
            return Response({"error": "No skill name provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Find all skills with this name and keep only the most recent one
        matching_skills = Skill.objects.filter(user=request.user, name__iexact=skill_name).order_by('-id')
        if matching_skills.exists():
            skill = matching_skills.first()
            skill.proficiency = proficiency
            skill.category = category
            skill.description = description
            skill.save()
            # Delete any duplicates
            matching_skills.exclude(id=skill.id).delete()
            return Response({"message": f"Skill '{skill_name}' updated.", "data": SkillSerializer(skill).data})
        else:
            # Create if doesn't exist
            skill = Skill.objects.create(user=request.user, name=skill_name, proficiency=proficiency, category=category, description=description)
            return Response({"message": f"Skill '{skill_name}' created.", "data": SkillSerializer(skill).data}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['POST'], url_path='cleanup_duplicates')
    def cleanup_duplicates(self, request):
        """Remove duplicate skills, keeping the most recently updated one"""
        skills = Skill.objects.filter(user=request.user)
        seen = {}
        deleted_count = 0

        for skill in skills.order_by('-id'):  # Most recent first
            name_lower = skill.name.lower().strip()
            if name_lower in seen:
                skill.delete()
                deleted_count += 1
            else:
                seen[name_lower] = skill.id

        return Response({"message": f"Cleaned up {deleted_count} duplicate skills."}, status=status.HTTP_200_OK)


@api_view(['GET'])
@drf_permission_classes([permissions.IsAuthenticated])
def get_skills_design(request):
    """Get skills design settings for the current user"""
    settings = SkillsDesignSettings.objects.filter(user=request.user).first()
    if settings:
        return Response(SkillsDesignSettingsSerializer(settings).data)
    return Response({"design_config": None}, status=status.HTTP_200_OK)


@api_view(['POST'])
@drf_permission_classes([permissions.IsAuthenticated])
def update_skills_design(request):
    """Update or create skills design settings"""
    design_config = request.data.get('design_config')
    if not design_config:
        return Response({"error": "No design config provided"}, status=status.HTTP_400_BAD_REQUEST)

    settings, created = SkillsDesignSettings.objects.get_or_create(user=request.user)
    settings.design_config = design_config
    settings.save()

    return Response({
        "message": "Skills design updated successfully",
        "design_config": settings.design_config
    })
