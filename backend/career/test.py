from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from .models import CareerEntry, CareerDesignSettings, Skill
from .serializers import CareerEntrySerializer, CareerDesignSettingsSerializer, SkillSerializer
import openai
import os

openai.api_key = os.environ.get("OPENAI_API_KEY", "")

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
        Fetch career descriptions, extract skills via AI, and return them using proper casing.
        The AI prompt includes an exclusion list of skills that are already selected to avoid duplicates.
        """
        user = request.user
        career_entries = CareerEntry.objects.filter(user=user)
        descriptions = [entry.description for entry in career_entries if entry.description]
        if not descriptions:
            return Response({"error": "No career descriptions found."}, status=status.HTTP_404_NOT_FOUND)
        combined_text = " ".join(descriptions)
        
        # Fetch already selected skills from the Skill model to avoid duplicates.
        existing_skills = list(Skill.objects.filter(user=user).values_list('name', flat=True))
        
        prompt_text = (
            f"{combined_text}\n\n"
            f"Please extract and list the key skills from the above career descriptions. "
            f"Exclude the following skills since they are already selected: {', '.join(existing_skills)}."
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

    def perform_create(self, serializer):
        # Automatically set the user field to the logged-in user.
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['POST'], url_path='bulk_create')
    def bulk_create(self, request):
        """
        Create multiple skills at once.
        Expects a payload like:
            {
                "skills": [
                    {"name": "Python", "proficiency": 5},
                    {"name": "React", "proficiency": 4}
                ]
            }
        """
        skills_data = request.data.get("skills", [])
        if not skills_data:
            return Response({"error": "No skills provided."}, status=status.HTTP_400_BAD_REQUEST)

        created_skills = []
        for skill in skills_data:
            skill_name = skill.get("name", "").strip()
            # Avoid creating duplicate skills (ignoring case)
            if Skill.objects.filter(user=request.user, name__iexact=skill_name).exists():
                continue  # Skip duplicate
            serializer = SkillSerializer(data=skill)
            if serializer.is_valid():
                serializer.save(user=request.user)
                created_skills.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {"message": "Skills created successfully", "data": created_skills},
            status=status.HTTP_201_CREATED
        )