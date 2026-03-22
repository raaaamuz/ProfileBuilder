from rest_framework import serializers
from .models import CareerEntry, CareerDesignSettings, Skill, Language, SkillsDesignSettings

class CareerEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerEntry
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}  # Ensure user is read-only

class CareerDesignSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerDesignSettings
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}


class SkillsDesignSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillsDesignSettings
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}