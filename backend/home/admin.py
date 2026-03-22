from django.contrib import admin
from .models import HomePageContent


@admin.register(HomePageContent)
class HomePageContentAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'is_published')
    search_fields = ('user__username', 'title', 'description')
