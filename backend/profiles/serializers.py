from rest_framework import serializers
from .models import UserProfile, ProfileDesign, ProfileNote

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'full_name', 'email', 'phone', 'bio', 'profile_picture', 'cv', 'location', 'address', 'job_title', 'years_experience', 'show_availability', 'show_download_cv']
        extra_kwargs = {
            'full_name': {'required': False, 'allow_blank': True},
            'email': {'required': False, 'allow_blank': True},
            'phone': {'required': False, 'allow_blank': True},
            'bio': {'required': False, 'allow_blank': True},
            'profile_picture': {'required': False},
            'cv': {'required': False},
            'location': {'required': False, 'allow_blank': True},
            'address': {'required': False, 'allow_blank': True},
            'job_title': {'required': False, 'allow_blank': True},
            'years_experience': {'required': False, 'allow_blank': True},
            'show_availability': {'required': False},
            'show_download_cv': {'required': False},
        }

class ProfileDesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileDesign
        fields = ['design_config']


class ProfileNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileNote
        fields = ['id', 'title', 'content', 'section', 'highlight_color', 'is_pinned', 'is_visible', 'order', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
