from django.urls import path
from .views import ServiceListCreateView, ServiceDetailView, PublicServiceListView

urlpatterns = [
    path('', ServiceListCreateView.as_view(), name='service-list-create'),
    path('<int:pk>/', ServiceDetailView.as_view(), name='service-detail'),
    path('public/<str:username>/', PublicServiceListView.as_view(), name='public-service-list'),
]
