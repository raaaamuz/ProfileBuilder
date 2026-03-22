from rest_framework import serializers
from .models import HomePageContent

class HomePageContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePageContent
        fields = "__all__"

    def validate_custom_settings(self, value):
        """Ensure required fields exist in custom_settings"""
        default_settings = {
            "textColor": "#ffffff",
            "backgroundColor": "#000000",
            "fontFamily": "Arial",
        }

        if not isinstance(value, dict):
            raise serializers.ValidationError("custom_settings must be a dictionary.")

        # Merge defaults if missing fields
        for key, default_value in default_settings.items():
            value.setdefault(key, default_value)

        return value
