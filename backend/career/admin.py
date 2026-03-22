from django.contrib import admin
from .models import CareerEntry, CareerDesignSettings, Skill, SkillsDesignSettings, Language


@admin.register(CareerEntry)
class CareerEntryAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'user', 'year', 'order')
    list_filter = ('user', 'public_profile')
    search_fields = ('title', 'company', 'description')
    ordering = ('user', 'order')


@admin.register(CareerDesignSettings)
class CareerDesignSettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'font_family', 'font_size')
    search_fields = ('user__username',)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'category', 'proficiency', 'order')
    list_filter = ('category', 'user')
    search_fields = ('name', 'user__username')
    ordering = ('user', 'category', 'order')


@admin.register(SkillsDesignSettings)
class SkillsDesignSettingsAdmin(admin.ModelAdmin):
    list_display = ('user', 'updated_at')
    search_fields = ('user__username',)


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'proficiency')
    list_filter = ('proficiency',)
    search_fields = ('name', 'user__username')
