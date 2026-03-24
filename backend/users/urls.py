from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import (
    register,
    public_profile,
    get_tab_settings,
    update_tab_settings,
    get_username,
    get_account_info,
    verify_email,
    resend_verification,
    forgot_password,
    reset_password,
    admin_dashboard,
    activate_all_users_dev,
)

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', obtain_auth_token, name='login'),  # Django Auth Token Login
    path('username/', get_username, name='get_username'),
    path('account/', get_account_info, name='get_account_info'),
    path('settings/', get_tab_settings, name='get_tab_settings'),
    path('settings/update/', update_tab_settings, name='update_tab_settings'),
    path('public-profile/<uuid:public_token>/', public_profile, name='public-profile'),
    path('verify-email/<uuid:token>/', verify_email, name='verify-email'),
    path('resend-verification/', resend_verification, name='resend-verification'),
    path('forgot-password/', forgot_password, name='forgot-password'),
    path('reset-password/<uuid:token>/', reset_password, name='reset-password'),
    path('admin-dashboard/', admin_dashboard, name='admin-dashboard'),
    path('dev/activate-all/', activate_all_users_dev, name='activate-all-users-dev'),
]
