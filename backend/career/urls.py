from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CareerEntryViewSet, CareerDesignSettingsViewSet, SkillViewSet, reorder_career, get_skills_design, update_skills_design

router = DefaultRouter()
router.register(r'entries', CareerEntryViewSet, basename='entry')
router.register(r'settings', CareerDesignSettingsViewSet, basename='settings')
router.register(r'skill', SkillViewSet, basename='skill')  # Register SkillViewSet

urlpatterns = [
    path('', include(router.urls)),
    path('generate_public_link/', CareerDesignSettingsViewSet.as_view({'post': 'generate_public_link'}), name='generate-public-link'),
    path('reorder/', reorder_career, name='reorder-career'),
    path('skills-design/', get_skills_design, name='get-skills-design'),
    path('skills-design/update/', update_skills_design, name='update-skills-design'),
]