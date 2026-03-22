from django.contrib import admin
from .models import EducationEntry, EducationDesign


@admin.register(EducationEntry)
class EducationEntryAdmin(admin.ModelAdmin):
    list_display = ('degree', 'university', 'user', 'year', 'order')
    list_filter = ('user',)
    search_fields = ('degree', 'university', 'description')
    ordering = ('user', 'order')


@admin.register(EducationDesign)
class EducationDesignAdmin(admin.ModelAdmin):
    list_display = ('user', 'selected_design')
    search_fields = ('user__username',)
