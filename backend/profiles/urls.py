from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileViewSet, get_user_profile, get_contact_info,
    resume_status, resume_generate, resume_approve, resume_download, resume_download_pdf, resume_download_docx,
    public_resume_download, resume_parse, resume_import, check_cv_status, resume_parse_existing,
    resume_html, public_resume_html, update_resume_html, ProfileDesignView, check_onboarding_status, upload_cv,
    skip_onboarding, ProfileNoteViewSet, public_profile_notes, resume_templates, resume_template_css,
    parse_cv_and_fill
)

router = DefaultRouter()
router.register(r'user-profile', UserProfileViewSet, basename='user-profile')
router.register(r'notes', ProfileNoteViewSet, basename='profile-notes')

urlpatterns = [
    path('', include(router.urls)),
    path('get-user-profile/<str:username>/', get_user_profile, name='get-user-profile'),
    path('contact-info/', get_contact_info, name='get-contact-info'),
    # Resume API endpoints
    path('resume/templates/', resume_templates, name='resume-templates'),
    path('resume/template-css/<str:template_id>/', resume_template_css, name='resume-template-css'),
    path('resume/status/', resume_status, name='resume-status'),
    path('resume/generate/', resume_generate, name='resume-generate'),
    path('resume/approve/', resume_approve, name='resume-approve'),
    path('resume/download/', resume_download, name='resume-download'),
    path('resume/download-pdf/', resume_download_pdf, name='resume-download-pdf'),
    path('resume/download-docx/', resume_download_docx, name='resume-download-docx'),
    path('resume/html/', resume_html, name='resume-html'),
    path('resume/update/', update_resume_html, name='resume-update'),
    path('resume/public/<str:username>/', public_resume_download, name='public-resume-download'),
    path('resume/public/<str:username>/html/', public_resume_html, name='public-resume-html'),
    path('resume/parse/', resume_parse, name='resume-parse'),
    path('resume/parse-existing/', resume_parse_existing, name='resume-parse-existing'),
    path('resume/import/', resume_import, name='resume-import'),
    path('cv/status/', check_cv_status, name='cv-status'),
    path('design/', ProfileDesignView.as_view(), name='profile-design'),
    # Onboarding endpoints
    path('onboarding/status/', check_onboarding_status, name='onboarding-status'),
    path('upload-cv/', upload_cv, name='upload-cv'),
    path('parse-cv/', parse_cv_and_fill, name='parse-cv'),
    path('skip-onboarding/', skip_onboarding, name='skip-onboarding'),
    # Notes endpoints
    path('notes/public/<str:username>/', public_profile_notes, name='public-profile-notes'),
]
