from rest_framework import serializers
from .models import Award, Achievement, AwardsDesignSettings


class AwardsDesignSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AwardsDesignSettings
        fields = ['id', 'design_config', 'updated_at']
        read_only_fields = ['id', 'updated_at']


class AwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Award
        fields = ['id', 'title', 'organization', 'year', 'description', 'order']
        read_only_fields = ['id']


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'title', 'description', 'year', 'order']
        read_only_fields = ['id']
