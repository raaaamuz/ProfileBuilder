from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('to_user', 'first_name', 'last_name', 'email', 'subject', 'is_read', 'created_at')
    list_filter = ('is_read', 'to_user', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'subject', 'message')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
