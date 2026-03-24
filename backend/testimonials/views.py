from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from users.models import CustomUser
from .models import Testimonial
from .serializers import TestimonialSerializer


class TestimonialListCreateView(generics.ListCreateAPIView):
    """
    GET: List all testimonials for the authenticated user
    POST: Create a new testimonial (handles multipart for image upload)
    """
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return Testimonial.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TestimonialDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a single testimonial
    PUT/PATCH: Update a testimonial (handles multipart for image upload)
    DELETE: Delete a testimonial
    """
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return Testimonial.objects.filter(user=self.request.user)


class PublicTestimonialListView(generics.ListAPIView):
    """
    GET: List active testimonials for a user (public endpoint, filtered by username)
    """
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        username = self.kwargs.get('username')
        user = get_object_or_404(CustomUser, username__iexact=username)
        return Testimonial.objects.filter(user=user, is_active=True)
