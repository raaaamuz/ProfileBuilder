from django.db import models
from django.conf import settings  # Import settings for AUTH_USER_MODEL

class EducationEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="education_entries")
    year = models.CharField(max_length=50, blank=True)
    degree = models.CharField(max_length=255, blank=True)
    university = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True, null=True)  # New description field
    color = models.CharField(max_length=7, default="#ffffff")  # Background color
    order = models.IntegerField(default=0)  # For ordering entries

    class Meta:
        ordering = ['order', '-id']

    def __str__(self):
        return f"{self.degree} at {self.university} ({self.year})"

def default_education_design_config():
    """Default design config for education section"""
    return {
        "backgroundColor": "#1a1a2e",
        "textColor": "#eaeaea",
        "accentColor": "#7c3aed",
        "fontFamily": "Inter, sans-serif",
        "layoutType": "cards",
        "cardStyle": "elevated",
        "borderRadius": 12,
        "spacing": "normal"
    }

class EducationDesign(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    selected_design = models.CharField(max_length=20, default="design1")
    design_config = models.JSONField(default=default_education_design_config, blank=True, null=True)