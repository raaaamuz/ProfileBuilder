from django.db import models
from users.models import CustomUser


class Testimonial(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='testimonials')
    client_name = models.CharField(max_length=200)
    client_title = models.CharField(max_length=200, blank=True)  # e.g., "CEO at TechCorp"
    client_company = models.CharField(max_length=200, blank=True)
    client_photo = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    content = models.TextField()  # The testimonial quote
    rating = models.IntegerField(default=5, choices=[(i, i) for i in range(1, 6)])  # 1-5 stars
    project_name = models.CharField(max_length=200, blank=True)  # What project was this for
    date = models.DateField(blank=True, null=True)  # When was this given
    linkedin_url = models.URLField(blank=True)  # Link to their LinkedIn for verification
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.client_name} - {self.client_company}"
