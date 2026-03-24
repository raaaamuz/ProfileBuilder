from django.urls import path
from .views import TestimonialListCreateView, TestimonialDetailView, PublicTestimonialListView

urlpatterns = [
    path('', TestimonialListCreateView.as_view(), name='testimonial-list-create'),
    path('<int:pk>/', TestimonialDetailView.as_view(), name='testimonial-detail'),
    path('public/<str:username>/', PublicTestimonialListView.as_view(), name='public-testimonial-list'),
]
