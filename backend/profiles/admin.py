from django.contrib import admin
from .models import UserProfile, ProfileDesign, ProfileNote


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'job_title', 'location', 'years_experience')
    search_fields = ('user__username', 'user__email', 'job_title', 'location')
    list_filter = ('years_experience',)


@admin.register(ProfileDesign)
class ProfileDesignAdmin(admin.ModelAdmin):
    list_display = ('user',)
    search_fields = ('user__username',)


@admin.register(ProfileNote)
class ProfileNoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'is_visible', 'created_at')
    list_filter = ('is_visible',)
    search_fields = ('user__username', 'title', 'content')
