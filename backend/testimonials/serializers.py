from rest_framework import serializers
from .models import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            'id', 'client_name', 'client_title', 'client_company', 'client_photo',
            'content', 'rating', 'project_name', 'date', 'linkedin_url',
            'is_featured', 'is_active', 'order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'client_name': {'required': True},
            'content': {'required': True},
            'client_title': {'required': False, 'allow_blank': True},
            'client_company': {'required': False, 'allow_blank': True},
            'client_photo': {'required': False},
            'project_name': {'required': False, 'allow_blank': True},
            'date': {'required': False, 'allow_null': True},
            'linkedin_url': {'required': False, 'allow_blank': True},
            'is_featured': {'required': False},
            'is_active': {'required': False},
            'order': {'required': False},
        }
