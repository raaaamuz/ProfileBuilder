from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from django.utils.datastructures import MultiValueDictKeyError
from .models import HomePageContent
from .serializers import HomePageContentSerializer
import json

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

    # Use POST instead of data to avoid copying file objects
    data = request.POST.copy()

    # Handle custom_settings JSON string
    if "custom_settings" in data:
        try:
            data["custom_settings"] = json.loads(data["custom_settings"])
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format for custom_settings"}, status=400)

    # Extract and remove background_video from the data
    background_video = request.FILES.get("background_video", None)
    data.pop("background_video", None)

    # Validate and update without the file
    serializer = HomePageContentSerializer(content, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()

        # Update the background_video separately
        if background_video:
            # Ensure the file pointer is at the beginning
            background_video.file.seek(0)
            content.background_video = background_video
            content.save(update_fields=["background_video"])

        return Response({"message": "Home page updated successfully!"})

    return Response(serializer.errors, status=400)


# ✅ Fetch Logged-in User's Homepage Data
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_home(request):
    home_content, _ = HomePageContent.objects.get_or_create(user=request.user)
    serializer = HomePageContentSerializer(home_content)
    return Response(serializer.data)


# ✅ Fetch Social Media Links for a User's Homepage
@api_view(['GET'])
@permission_classes([AllowAny])
def get_social_media_info(request, username):
    home_content = get_object_or_404(HomePageContent, user__username__iexact=username, is_published=True)
    
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

    # Convert QueryDict to regular dict for easier manipulation
    data = dict(request.POST)
    # QueryDict stores values as lists, flatten single values
    data = {k: v[0] if isinstance(v, list) and len(v) == 1 else v for k, v in data.items()}

    # Handle custom_settings JSON string from POST data
    if "custom_settings" in data:
        try:
            data["custom_settings"] = json.loads(data["custom_settings"])
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format for custom_settings"}, status=400)

    # Safely extract the background_video file before processing the data
    background_video = request.FILES.get("background_video", None)
    data.pop("background_video", None)

    # Validate and save content without the file
    serializer = HomePageContentSerializer(home_content, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()

        # Update the background_video separately
        if background_video:
            # Ensure the file pointer is at the beginning
            background_video.file.seek(0)
            home_content.background_video = background_video
            home_content.save(update_fields=["background_video"])

        # Refresh and return the updated data including the video URL
        home_content.refresh_from_db()
        updated_serializer = HomePageContentSerializer(home_content)
        return Response(updated_serializer.data)

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
    from profiles.models import UserProfile
    from profiles.serializers import UserProfileSerializer

    home_content = get_object_or_404(HomePageContent, user__username__iexact=username, is_published=True)

    # Fetch the user's profile directly from the database
    try:
        user_profile = UserProfile.objects.get(user__username__iexact=username)
        profile_data = UserProfileSerializer(user_profile).data
    except UserProfile.DoesNotExist:
        profile_data = {"error": "Profile not found"}

    response_data = {
        "home_content": HomePageContentSerializer(home_content).data,
        "profile": profile_data
    }

    return Response(response_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_social_media_data(request):
    """
    Fetches social media links for the current user's HomePageContent.

    Returns:
        A JSON response containing the username and their social media links 
        (YouTube, LinkedIn, Facebook, and Twitter).
    """
    try:
        home_content = HomePageContent.objects.get(user=request.user)
    except HomePageContent.DoesNotExist:
        return Response({"message": "No home content available for the current user."}, status=404)
    
    social_media = {
        "username": request.user.username,
        "youtube": home_content.youtube_link,
        "linkedin": home_content.linkedin_link,
        "facebook": home_content.facebook_link,
        "twitter": home_content.twitter_link,
    }
    
    return Response({"social_media": social_media})
