from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints - list and view templates
    path('', views.list_templates, name='list-templates'),
    path('<slug:slug>/', views.get_template, name='get-template'),

    # User template management
    path('user/current/', views.get_user_template, name='user-template'),
    path('user/select/', views.select_template, name='select-template'),
    path('user/customize/', views.customize_template, name='customize-template'),
    path('user/reset/', views.reset_customizations, name='reset-customizations'),
    path('user/section/<str:section>/', views.get_section_config, name='section-config'),

    # Public profile template
    path('public/<str:username>/', views.get_public_template_config, name='public-template'),
]
