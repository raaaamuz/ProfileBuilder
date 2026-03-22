from django.db import models
from users.models import CustomUser

class CareerEntry(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="career_entries")
    year = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default="#ffffff")  # Background color
    borderColor = models.CharField(max_length=7, default="#000000")  # Border color
    public_profile = models.BooleanField(default=False)  # Whether to show in public profile
    order = models.IntegerField(default=0)  # For ordering entries

    class Meta:
        ordering = ['order', '-id']

    def __str__(self):
        return f"{self.title} at {self.company} ({self.year})"

def default_career_design_config():
    """Default design config for career section"""
    return {
        "backgroundColor": "#0f172a",
        "textColor": "#e2e8f0",
        "accentColor": "#3b82f6",
        "fontFamily": "Inter, sans-serif",
        "layoutType": "timeline",
        "cardStyle": "elevated",
        "borderRadius": 12,
        "spacing": "normal"
    }

class CareerDesignSettings(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="career_settings")
    card_width = models.IntegerField(default=350)
    card_height = models.IntegerField(default=180)
    font_size = models.IntegerField(default=16)
    font_family = models.CharField(max_length=50, default="Arial")
    design_config = models.JSONField(default=default_career_design_config, blank=True, null=True)

    def __str__(self):
        return f"Design Settings for {self.user.username}"
    
class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('programming', 'Programming'),
        ('tools', 'Tools & Software'),
        ('design', 'Design'),
        ('database', 'Database'),
        ('cloud', 'Cloud & DevOps'),
        ('soft_skills', 'Soft Skills'),
        ('other', 'Other'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="skills")
    name = models.CharField(max_length=100)
    proficiency = models.IntegerField(default=50, help_text="Skill proficiency level (0-100)")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    years_experience = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['category', 'order', '-proficiency']

    def __str__(self):
        return f"{self.name} ({self.proficiency}%)"


class Language(models.Model):
    PROFICIENCY_CHOICES = [
        ('native', 'Native'),
        ('fluent', 'Fluent'),
        ('advanced', 'Advanced'),
        ('intermediate', 'Intermediate'),
        ('basic', 'Basic'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="languages")
    name = models.CharField(max_length=100)
    proficiency = models.CharField(max_length=20, choices=PROFICIENCY_CHOICES, default='intermediate')

    def __str__(self):
        return f"{self.name} ({self.proficiency})"


def default_skills_design_config():
    """Default design config for skills section"""
    return {
        "id": "cards-elevated",
        "name": "Elevated Cards",
        "backgroundColor": "#ffffff",
        "textColor": "#1f2937",
        "accentColor": "#6366f1",
        "layoutType": "cards",
        "cardStyle": "elevated",
        "showProficiency": True,
        "showCategory": True,
    }


class SkillsDesignSettings(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="skills_design")
    design_config = models.JSONField(default=default_skills_design_config, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Skills Design for {self.user.username}"
    

