from django.db import models
from users.models import CustomUser


class Service(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='services')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    short_description = models.CharField(max_length=300, blank=True)  # For cards
    icon = models.CharField(max_length=50, blank=True)  # Lucide icon name
    price = models.CharField(max_length=100, blank=True)  # e.g., "$50/hr", "Starting at $500", "Contact for quote"
    price_type = models.CharField(max_length=50, default='hourly', choices=[
        ('hourly', 'Hourly'),
        ('fixed', 'Fixed Price'),
        ('starting', 'Starting At'),
        ('contact', 'Contact for Quote'),
    ])
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title
