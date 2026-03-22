from django.db import models
from django.conf import settings

def default_profile_design_config():
    """Default design config for profile/bio section"""
    return {
        "backgroundColor": "#1f2937",
        "textColor": "#ffffff",
        "accentColor": "#f87171",
        "nameColor": "#f87171",
        "fontFamily": "Inter, sans-serif",
        "cardStyle": "glassmorphism",
        "borderRadius": 16,
        "imageStyle": "circle",
        "layoutType": "horizontal"
    }

class ProfileDesign(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile_design")
    design_config = models.JSONField(default=default_profile_design_config, blank=True, null=True)

    def __str__(self):
        return f"Profile Design for {self.user.username}"

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=200, blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profiles/", default="profiles/default.jpg")
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    location = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    job_title = models.CharField(max_length=100, blank=True, null=True)
    years_experience = models.CharField(max_length=20, blank=True, null=True)
    cv = models.FileField(upload_to="profiles/cvs/", blank=True, null=True)
    ai_resume = models.FileField(upload_to="profiles/resumes/", blank=True, null=True)
    ai_resume_html = models.TextField(blank=True, null=True)
    resume_template = models.CharField(max_length=50, default='professional', blank=True)
    onboarding_completed = models.BooleanField(default=False)
    show_availability = models.BooleanField(default=True)
    show_download_cv = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username


class ProfileNote(models.Model):
    """Notes that admin users can add for viewers to see"""
    SECTION_CHOICES = [
        ('general', 'General'),
        ('home', 'Home'),
        ('career', 'Career'),
        ('education', 'Education'),
        ('skills', 'Skills'),
        ('achievements', 'Achievements'),
        ('blog', 'Blog'),
    ]
    HIGHLIGHT_COLORS = [
        ('yellow', 'Yellow'),
        ('green', 'Green'),
        ('blue', 'Blue'),
        ('pink', 'Pink'),
        ('purple', 'Purple'),
        ('orange', 'Orange'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile_notes")
    title = models.CharField(max_length=200)
    content = models.TextField()
    section = models.CharField(max_length=50, choices=SECTION_CHOICES, default='general')
    highlight_color = models.CharField(max_length=20, choices=HIGHLIGHT_COLORS, default='yellow')
    is_pinned = models.BooleanField(default=False)
    is_visible = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_pinned', 'order', '-created_at']

    def __str__(self):
        return f"{self.title} ({self.section})"
