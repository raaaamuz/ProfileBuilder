from django.db import models
from django.conf import settings


class DesignTemplate(models.Model):
    """Pre-built design templates from TemplateMo"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    source = models.CharField(max_length=100, help_text="e.g., templatemo-530")
    description = models.TextField(blank=True)
    thumbnail = models.CharField(max_length=255, blank=True)  # Path to thumbnail

    # Template style tags
    STYLE_CHOICES = [
        ('minimal', 'Minimal'),
        ('dark', 'Dark'),
        ('glassmorphism', 'Glassmorphism'),
        ('gradient', 'Gradient'),
        ('colorful', 'Colorful'),
        ('professional', 'Professional'),
    ]
    style = models.CharField(max_length=50, choices=STYLE_CHOICES, default='minimal')

    is_active = models.BooleanField(default=True)
    is_premium = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    # Complete design configuration for all sections
    config = models.JSONField(default=dict)
    # Structure:
    # {
    #   "global": { "primaryColor", "accentColor", "backgroundColor", "textColor", "fontFamily" },
    #   "profile": { "layoutType", "cardStyle", "imageStyle", ... },
    #   "education": { "layoutType", "cardStyle", ... },
    #   "career": { "layoutType", "cardStyle", ... },
    #   "resume": { "template", "sidebarColor", ... },
    #   "awards": { "layoutType", "cardStyle", ... },
    #   "skills": { "layoutType", "showProficiency", ... },
    #   "generic": { ... }  # For custom sections
    # }

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class UserSelectedTemplate(models.Model):
    """User's selected template and customizations"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='selected_template'
    )
    template = models.ForeignKey(
        DesignTemplate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    # User's customizations on top of template
    # Only stores overrides, not the full config
    customizations = models.JSONField(default=dict)
    # Structure:
    # {
    #   "profile": { "accentColor": "#custom" },
    #   "career": { "cardStyle": "flat" }
    # }

    selected_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User Selected Template"
        verbose_name_plural = "User Selected Templates"

    def __str__(self):
        return f"{self.user.username} - {self.template.name if self.template else 'No template'}"

    def get_merged_config(self, section=None):
        """Get template config merged with user customizations"""
        if not self.template:
            return {}

        base_config = self.template.config.copy()

        # Merge customizations
        for sec, overrides in self.customizations.items():
            if sec in base_config:
                base_config[sec] = {**base_config[sec], **overrides}
            else:
                base_config[sec] = overrides

        if section:
            return base_config.get(section, base_config.get('generic', {}))

        return base_config
