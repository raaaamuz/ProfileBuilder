from django.contrib import admin
from .models import DesignTemplate, UserSelectedTemplate


@admin.register(DesignTemplate)
class DesignTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'style', 'source', 'is_active', 'is_premium', 'order']
    list_filter = ['style', 'is_active', 'is_premium']
    search_fields = ['name', 'slug', 'source']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']


@admin.register(UserSelectedTemplate)
class UserSelectedTemplateAdmin(admin.ModelAdmin):
    list_display = ['user', 'template', 'selected_at']
    list_filter = ['template']
    search_fields = ['user__username', 'template__name']
    raw_id_fields = ['user', 'template']
