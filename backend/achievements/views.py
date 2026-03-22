from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Award, Achievement, AwardsDesignSettings
from .serializers import AwardSerializer, AchievementSerializer, AwardsDesignSettingsSerializer


class PublicReadPermission(permissions.BasePermission):
    """Allow public GET, require auth for modifications."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated


class AwardViewSet(viewsets.ModelViewSet):
    serializer_class = AwardSerializer
    permission_classes = [PublicReadPermission]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Award.objects.filter(user=self.request.user)
        return Award.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["PUT"], permission_classes=[permissions.IsAuthenticated])
    def reorder(self, request):
        """Reorder awards"""
        reordered_data = request.data.get("reorderedData", [])
        for index, item in enumerate(reordered_data):
            Award.objects.filter(id=item.get("id"), user=request.user).update(order=index)
        return Response({"message": "Order updated successfully"})


class AchievementViewSet(viewsets.ModelViewSet):
    serializer_class = AchievementSerializer
    permission_classes = [PublicReadPermission]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Achievement.objects.filter(user=self.request.user)
        return Achievement.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["PUT"], permission_classes=[permissions.IsAuthenticated])
    def reorder(self, request):
        """Reorder achievements"""
        reordered_data = request.data.get("reorderedData", [])
        for index, item in enumerate(reordered_data):
            Achievement.objects.filter(id=item.get("id"), user=request.user).update(order=index)
        return Response({"message": "Order updated successfully"})


class AwardsDesignView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get the user's awards design settings"""
        settings, created = AwardsDesignSettings.objects.get_or_create(user=request.user)
        serializer = AwardsDesignSettingsSerializer(settings)
        return Response(serializer.data)

    def put(self, request):
        """Update the user's awards design settings"""
        settings, created = AwardsDesignSettings.objects.get_or_create(user=request.user)
        serializer = AwardsDesignSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
