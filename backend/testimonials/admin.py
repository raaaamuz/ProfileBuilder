from django.contrib import admin
from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['client_name', 'client_company', 'rating', 'is_featured', 'is_active', 'user', 'created_at']
    list_filter = ['user', 'rating', 'is_featured', 'is_active']
    search_fields = ['client_name', 'client_company', 'content', 'project_name']
    list_editable = ['is_featured', 'is_active']
    ordering = ['order', '-created_at']
