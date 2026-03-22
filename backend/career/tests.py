from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from users.models import CustomUser
from .models import CareerEntry, CareerDesignSettings,Skill
from .serializers import CareerEntrySerializer, CareerDesignSettingsSerializer,SkillSerializer


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
    permission_classes = [PublicReadPermission]  # Public GET access, Auth required for others

    def get_queryset(self):
        return CareerEntry.objects.all()  # Publicly accessible

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["DELETE"], permission_classes=[permissions.IsAuthenticated])
    def clear_entries(self, request):
        """Delete all career entries for the user"""
        CareerEntry.objects.filter(user=request.user).delete()
        return Response({"message": "All career entries deleted."}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["DELETE"], url_path='delete_entry', permission_classes=[permissions.IsAuthenticated])
    def delete_entry(self, request, pk=None):
        """Delete a specific career entry by ID"""
        try:
            entry = CareerEntry.objects.get(pk=pk, user=request.user)
            entry.delete()
            return Response({"message": "Career entry deleted."}, status=status.HTTP_204_NO_CONTENT)
        except CareerEntry.DoesNotExist:
            return Response({"error": "Career entry not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["PUT"], url_path='update_entry', permission_classes=[permissions.IsAuthenticated])
    def update_entry(self, request, pk=None):
        """Update a specific career entry by ID"""
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
        """Allows users to save multiple career entries at once"""
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

        return Response({"message": "Career entries saved successfully", "data": created_entries}, status=status.HTTP_201_CREATED)


class CareerDesignSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = CareerDesignSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]  # Public GET access, Auth required for others

    def get_queryset(self):
        return CareerDesignSettings.objects.all()  # Publicly accessible

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
    A viewset for viewing and editing Skill instances.
    """
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return skills only for the authenticated user.
        return Skill.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign the authenticated user as the owner of the skill.
        serializer.save(user=self.request.user)