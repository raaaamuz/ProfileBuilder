from rest_framework import serializers
from .models import EducationEntry, EducationDesign

class EducationEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationEntry
        fields = ['id', 'year', 'degree', 'university', 'description', 'color']  # Include description here

class EducationDesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationDesign
        fields = ['selected_design', 'design_config']