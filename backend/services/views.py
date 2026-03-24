from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Service
from .serializers import ServiceSerializer

User = get_user_model()


class ServiceListCreateView(generics.ListCreateAPIView):
    """
    GET: List all services for the authenticated user
    POST: Create a new service for the authenticated user
    """
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Service.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a single service
    PUT: Update a service
    DELETE: Delete a service
    """
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Service.objects.filter(user=self.request.user)


class PublicServiceListView(generics.ListAPIView):
    """
    GET: List all active services for a specific user (public endpoint)
    """
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        username = self.kwargs.get('username')
        try:
            user = User.objects.get(username=username)
            return Service.objects.filter(user=user, is_active=True)
        except User.DoesNotExist:
            return Service.objects.none()

    def list(self, request, *args, **kwargs):
        username = self.kwargs.get('username')
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        return super().list(request, *args, **kwargs)
