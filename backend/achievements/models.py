from django.db import models
from django.conf import settings


class AwardsDesignSettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="awards_design_settings")
    design_config = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Awards Design Settings for {self.user.username}"


class Award(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="awards")
    title = models.CharField(max_length=255, blank=True)
    organization = models.CharField(max_length=255, blank=True)
    year = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-year']

    def __str__(self):
        return f"{self.title} - {self.organization} ({self.year})"


class Achievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="achievements")
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    year = models.CharField(max_length=50, blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-year']

    def __str__(self):
        return f"{self.title} ({self.year})"
