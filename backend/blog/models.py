from django.conf import settings
from django.db import models

from django.conf import settings
from django.db import models

class BlogPost(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="The user who wrote the blog post."
    )
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    content = models.TextField()
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    likes = models.PositiveIntegerField(default=0)
    shares = models.PositiveIntegerField(default=0)
    views = models.IntegerField(default=0)  # If you want to track view counts

    def __str__(self):
        return self.title


class Comment(models.Model):
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    # For nested replies - parent comment (null for top-level comments)
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='replies',
        help_text="Parent comment for replies. Leave empty for top-level comments."
    )
    # For logged in users (social or otherwise), we link to the user model.
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        help_text="Leave empty if commenting as a guest."
    )
    # For guest users, capture their name and email.
    guest_name = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Name of the guest commenter."
    )
    guest_email = models.EmailField(
        blank=True,
        null=True,
        help_text="Email address of the guest commenter."
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def commenter_display(self):
        """Return the display name for the commenter."""
        if self.user:
            return self.user.get_full_name() or self.user.username
        return self.guest_name or "Guest"

    def __str__(self):
        return f"Comment by {self.commenter_display()} on {self.blog_post.title} at {self.created_at}"
