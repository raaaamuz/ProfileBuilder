from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserTabSettings


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_email_verified', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('is_email_verified', 'is_active', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email')
    ordering = ('-date_joined',)
    readonly_fields = ('public_token', 'email_verification_token', 'email_verification_sent_at')

    fieldsets = UserAdmin.fieldsets + (
        ('Profile', {'fields': ('bio', 'profile_picture', 'is_public', 'public_token')}),
        ('Email Verification', {'fields': ('is_email_verified', 'email_verification_token', 'email_verification_sent_at')}),
    )


@admin.register(UserTabSettings)
class UserTabSettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'settings')
    search_fields = ('user__username',)
