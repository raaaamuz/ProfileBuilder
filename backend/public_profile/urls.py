from django.urls import path
from .views import PublicProfileAggregateView,PublicProfileAggregateViewResume

urlpatterns = [
    path('profile/<str:username>/', PublicProfileAggregateView.as_view(), name='public_profile_aggregate'),
    path('resume/<str:username>/', PublicProfileAggregateViewResume.as_view(), name='public_profile_aggregate_resume'),
]
