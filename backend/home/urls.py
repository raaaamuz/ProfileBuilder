from django.urls import path
from .views import (
    get_user_home,
    get_social_media_info,
    update_user_home,
    publish_home,
    get_public_home
)
from home.views import get_current_social_media_data  # Import only this function
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', get_user_home, name='get_user_home'),  # Fetch user's home settings
    path('update/', update_user_home, name='update_user_home'),  # Update homepage
    path('publish/', publish_home, name='publish_home'),  # Publish homepage
    path('public/<str:username>/', get_public_home, name='get_public_home'),  # Fetch public homepage
    path('social-media/<str:username>/', get_social_media_info, name='get_social_media_info'),  # Fetch social media links for a given username
    path('social-media/', get_current_social_media_data, name='get-current-social-media-data'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
