from django.contrib import admin
from .models import BlogPost, Comment

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'likes', 'shares')
    search_fields = ('title', 'category')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'blog_post', 'commenter_display', 'created_at')
    search_fields = ('blog_post__title', 'user__username', 'guest_name')
