from django.db import models
from django.conf import settings
import json

def default_custom_settings():
    """Ensures default settings if missing"""
    return {
        "textColor": "#ffffff",
        "backgroundColor": "#000000",
        "fontFamily": "Arial"
    }

class HomePageContent(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, blank=True, default="")
    description = models.TextField(blank=True, default="")
    background_video = models.FileField(upload_to='videos/', null=True, blank=True)
    youtube_link = models.URLField(max_length=200, blank=True)
    linkedin_link = models.URLField(max_length=200, blank=True)
    facebook_link = models.URLField(max_length=200, blank=True)
    twitter_link = models.URLField(max_length=200, blank=True)
    github_link = models.URLField(max_length=200, blank=True)
    instagram_link = models.URLField(max_length=200, blank=True)
    is_published = models.BooleanField(default=False)
    
    # ✅ JSONField to store UI settings with a default fallback
    custom_settings = models.JSONField(default=default_custom_settings)

    def save(self, *args, **kwargs):
        """Ensure `custom_settings` is never empty"""
        if not self.custom_settings or not isinstance(self.custom_settings, dict):
            self.custom_settings = default_custom_settings()
        else:
            # Merge with defaults if missing keys
            for key, value in default_custom_settings().items():
                self.custom_settings.setdefault(key, value)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
