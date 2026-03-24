from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),  
    path('api/users/', include('users.urls')),  # Include user-related routes
    path('api/home/', include('home.urls')),    # Include home-related routes
    path('api/profile/', include('profiles.urls')),
    path('api/career/', include('career.urls')),
    path('api/education/', include('education.urls')),
    path('api/ai/', include('ai.urls')),
    path('api/blog/', include('blog.urls')),
    path('api/public/', include('public_profile.urls')),
    path('api/achievements/', include('achievements.urls')),
    path('api/contact/', include('contact.urls')),
    path('api/templates/', include('templates_design.urls')),
    path('api/services/', include('services.urls')),
    path('api/testimonials/', include('testimonials.urls')),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)