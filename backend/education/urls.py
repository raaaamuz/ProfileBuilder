from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EducationEntryViewSet, EducationDesignAPIView, update_selected_design, reorder_education

router = DefaultRouter()
router.register(r'entries', EducationEntryViewSet, basename='educationentry')

urlpatterns = [
    path('', include(router.urls)),  # Include the router-based endpoints
    path("selected-design/", EducationDesignAPIView.as_view(), name="selected_design"),
    path("update-selected-design/", update_selected_design, name="update_selected_design"),
    path("reorder/", reorder_education, name="reorder_education"),
]