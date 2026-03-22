from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import HomePageContent
from .serializers import HomePageContentSerializer
import json
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import HomePageContent
from .serializers import HomePageContentSerializer
import requests

# ✅ Fetch Public Homepage
@api_view(['GET'])
@permission_classes([AllowAny])
def get_home_content(request):
    content = HomePageContent.objects.first()
    if content:
        serializer = HomePageContentSerializer(content)
        return Response(serializer.data)
    return Response({"message": "No home content available"}, status=404)


# ✅ Admin: Update Global Homepage (Handles files & custom settings)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def update_home_content(request):
    content = HomePageContent.objects.first()
    if not content:
        return Response({"error": "No home content found to update."}, status=404)

    data = request.data.copy()  # Shallow copy to avoid deep copy issues

    # ✅ Handle `custom_settings` separately to avoid JSON errors
    if "custom_settings" in request.data:
        try:
            data["custom_settings"] = json.loads(request.data["custom_settings"])
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format for custom_settings"}, status=400)

    # ✅ Remove `background_video` from data before passing to serializer
    background_video = request.FILES.get("background_video", None)
    if "background_video" in data:
        del data["background_video"]

    # ✅ Validate and save content without the file
    serializer = HomePageContentSerializer(content, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()

        # ✅ If a new background video is uploaded, update it separately
        if (background_video):
            content.background_video = background_video
            content.save()

        return Response({"message": "Home page updated successfully!"})

    return Response(serializer.errors, status=400)


# ✅ Fetch Logged-in User's Homepage Data
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_home(request):
    home_content, _ = HomePageContent.objects.get_or_create(user=request.user)
    serializer = HomePageContentSerializer(home_content)
    return Response(serializer.data)


from django.utils.datastructures import MultiValueDictKeyError

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import HomePageContent
from .serializers import HomePageContentSerializer
import requests


# ✅ Fetch Social Media Links for a User's Homepage
@api_view(['GET'])
@permission_classes([AllowAny])
def get_social_media_info(request, username):
    home_content = get_object_or_404(HomePageContent, user__username=username, is_published=True)
    
    social_media_links = {
        "youtube": home_content.youtube_link,
        "linkedin": home_content.linkedin_link,
        "facebook": home_content.facebook_link,
        "twitter": home_content.twitter_link
    }
    
    return Response({"social_media": social_media_links})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_home(request):
    home_content = get_object_or_404(HomePageContent, user=request.user)

    data = request.data.copy()  # Shallow copy to avoid deep copy issues

    # ✅ Handle `custom_settings` separately (Convert JSON string to dictionary)
    custom_settings_header = request.headers.get("HTTP_CUSTOM_SETTINGS")  # Fix header case
    if custom_settings_header:
        print("XXXXXXX",type(custom_settings_header))
        try:
            data["custom_settings"] = json.loads(custom_settings_header)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format for custom_settings"}, status=400)

    # ✅ Safely extract the background_video file before serializer
    background_video = request.FILES.get("background_video", None)
    
    # Ensure background_video is removed from data before passing to serializer
    data.pop("background_video", None)  

    # ✅ Validate and save content without the file
    serializer = HomePageContentSerializer(home_content, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()

        # ✅ If a new background video is uploaded, update it separately
        if background_video:
            home_content.background_video = background_video
            home_content.save(update_fields=["background_video"])  # Explicitly update only the video field

        return Response({"message": "Homepage updated successfully!"})

    return Response(serializer.errors, status=400)


# ✅ Publish User's Homepage
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def publish_home(request):
    home_content = get_object_or_404(HomePageContent, user=request.user)

    if home_content.is_published:
        return Response({"message": "Homepage is already published!"})

    home_content.is_published = True
    home_content.save()
    return Response({"message": "Homepage published successfully!"})


# ✅ Fetch Public Homepage by Username
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_public_home(request, username):
    home_content = get_object_or_404(HomePageContent, user__username=username, is_published=True)
    
    # Fetch the user's profile details from the profiles app
    profile_url = f"http://127.0.0.1:8000/profile/user/{username}/"
    profile_response = requests.get(profile_url)
    
    if profile_response.status_code == 200:
        profile_data = profile_response.json()
    else:
        profile_data = {"error": "Profile not found"}

    response_data = {
        "home_content": HomePageContentSerializer(home_content).data,
        "profile": profile_data
    }

    return Response(response_data)