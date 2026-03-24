from rest_framework import serializers
from .models import DesignTemplate, UserSelectedTemplate


class DesignTemplateSerializer(serializers.ModelSerializer):
    """Serializer for listing templates"""

    class Meta:
        model = DesignTemplate
        fields = [
            'id', 'name', 'slug', 'source', 'description',
            'thumbnail', 'style', 'is_premium', 'config'
        ]


class DesignTemplateListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for template gallery (no full config)"""

    class Meta:
        model = DesignTemplate
        fields = [
            'id', 'name', 'slug', 'description', 'thumbnail',
            'style', 'is_premium'
        ]


class UserSelectedTemplateSerializer(serializers.ModelSerializer):
    """Serializer for user's selected template"""
    template = DesignTemplateSerializer(read_only=True)
    template_id = serializers.PrimaryKeyRelatedField(
        queryset=DesignTemplate.objects.filter(is_active=True),
        source='template',
        write_only=True
    )
    merged_config = serializers.SerializerMethodField()

    class Meta:
        model = UserSelectedTemplate
        fields = [
            'id', 'template', 'template_id', 'customizations',
            'merged_config', 'selected_at'
        ]

    def get_merged_config(self, obj):
        return obj.get_merged_config()


class SelectTemplateSerializer(serializers.Serializer):
    """Serializer for selecting a template"""
    template_id = serializers.IntegerField()

    def validate_template_id(self, value):
        try:
            template = DesignTemplate.objects.get(id=value, is_active=True)
        except DesignTemplate.DoesNotExist:
            raise serializers.ValidationError("Template not found or inactive")
        return value


class CustomizeTemplateSerializer(serializers.Serializer):
    """Serializer for customizing template sections"""
    section = serializers.CharField()
    customizations = serializers.DictField()

    def validate_section(self, value):
        valid_sections = [
            'global', 'profile', 'education', 'career',
            'resume', 'awards', 'skills', 'generic'
        ]
        if value not in valid_sections:
            raise serializers.ValidationError(f"Invalid section. Must be one of: {valid_sections}")
        return value
