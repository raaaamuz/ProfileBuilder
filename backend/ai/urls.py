# urls.py

from django.urls import path
from .views import improve_description, generate_keywords, generate_designs, import_from_cv

urlpatterns = [
    path("improve-description/", improve_description, name="improve-description"),
    path("image-keywords/", generate_keywords, name="image-keywords"),
    path("generate-designs/", generate_designs, name="generate-designs"),
    path("import-from-cv/", import_from_cv, name="import-from-cv"),
]
