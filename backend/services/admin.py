from django.contrib import admin
from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'price_type', 'is_featured', 'is_active', 'order']
    list_filter = ['user', 'price_type', 'is_featured', 'is_active']
    search_fields = ['title', 'description']
    ordering = ['order', '-created_at']
