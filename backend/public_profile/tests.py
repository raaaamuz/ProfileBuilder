from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from users.models import UserTabSettings

User = get_user_model()

# Import your serializers
from blog.serializers import BlogPostSerializer
from career.serializers import CareerEntrySerializer
from education.serializers import EducationEntrySerializer
from home.serializers import HomePageContentSerializer
from profiles.serializers import UserProfileSerializer
from users.serializers import UserTabSettingsSerializer

class PublicProfileAggregateView(APIView):
    permission_classes = []  # Allow public access

    def get(self, request, username):
        # Get the user by username
        user = get_object_or_404(User, username=username)

        # 1. Public blog posts
        from blog.models import BlogPost
        blog_posts = BlogPost.objects.filter(author=user)
        blog_data = BlogPostSerializer(blog_posts, many=True).data

        # 2. Career entries
        from career.models import CareerEntry
        career_entries = CareerEntry.objects.filter(user=user)
        career_data = CareerEntrySerializer(career_entries, many=True).data

        # 3. Education entries
        from education.models import EducationEntry
        education_entries = EducationEntry.objects.filter(user=user)
        education_data = EducationEntrySerializer(education_entries, many=True).data

        # 4. Public HomePage content
        from home.models import HomePageContent
        home_content = HomePageContent.objects.filter(user=user).first()
        home_data = HomePageContentSerializer(home_content).data if home_content else {}

        # 5. User Profile data (public version)
        from profiles.models import UserProfile
        user_profile_obj = UserProfile.objects.filter(user=user).first()
        profile_data = UserProfileSerializer(user_profile_obj).data if user_profile_obj else {}

        # 6. User Tab Settings (to get selected design, etc.)
        from users.models import UserTabSettings
        tab_settings_obj, created = UserTabSettings.objects.get_or_create(user=user, defaults={"settings": {}})
        tab_settings_data = UserTabSettingsSerializer(tab_settings_obj).data

        # Construct the response data
        response_data = {
            "blog_posts": blog_data,
            "career_entries": career_data,
            "education_entries": education_data,
            "home_content": home_data,
            "background_video": home_data.get("background_video", ""),
            "description": home_data.get("description", ""),
            "youtube_link": home_data.get("youtube_link", ""),
            "linkedin_link": home_data.get("linkedin_link", ""),
            "facebook_link": home_data.get("facebook_link", ""),
            "twitter_link": home_data.get("twitter_link", ""),
            "custom_settings": home_data.get("custom_settings", {}),
            "title": home_data.get("title", ""),
            "user_profile": profile_data,
            "tab_settings": tab_settings_data,  # Added tab settings response
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
