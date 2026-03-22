from django.contrib import admin
from .models import Award, Achievement


@admin.register(Award)
class AwardAdmin(admin.ModelAdmin):
    list_display = ['title', 'organization', 'year', 'user']
    list_filter = ['user', 'year']
    search_fields = ['title', 'organization']


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['title', 'year', 'user']
    list_filter = ['user', 'year']
    search_fields = ['title']
