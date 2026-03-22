from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AwardViewSet, AchievementViewSet, AwardsDesignView

router = DefaultRouter()
router.register(r'awards', AwardViewSet, basename='award')
router.register(r'achievements', AchievementViewSet, basename='achievement')

urlpatterns = [
    path('', include(router.urls)),
    path('design/', AwardsDesignView.as_view(), name='awards-design'),
]
