from django.urls import path
from .views import submit_contact, InboxView, MessageDetailView, mark_as_read, mark_all_read

urlpatterns = [
    path('submit/', submit_contact, name='contact-submit'),
    path('inbox/', InboxView.as_view(), name='contact-inbox'),
    path('message/<int:pk>/', MessageDetailView.as_view(), name='contact-message-detail'),
    path('message/<int:pk>/read/', mark_as_read, name='contact-mark-read'),
    path('mark-all-read/', mark_all_read, name='contact-mark-all-read'),
]
