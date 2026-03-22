from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from django.conf import settings  # ✅ Required for ForeignKey reference

class CustomUser(AbstractUser):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_public = models.BooleanField(default=True)  # ✅ Profile visibility toggle
    public_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)  # ✅ Public profile link

    # Email verification fields
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.UUIDField(default=uuid.uuid4, null=True, blank=True)
    email_verification_sent_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.username

    def generate_new_verification_token(self):
        self.email_verification_token = uuid.uuid4()
        self.save(update_fields=['email_verification_token'])

class UserTabSettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tab_settings")
    settings = models.JSONField(default=dict)  # Store tab settings as a JSON object

    def __str__(self):
        return f"{self.user.username}'s Tab Settings"
