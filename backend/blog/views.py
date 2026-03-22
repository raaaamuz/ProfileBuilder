from rest_framework import viewsets, permissions
from .models import BlogPost, Comment
from .serializers import BlogPostSerializer, CommentSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

class BlogPostViewSet(viewsets.ModelViewSet):
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users may access their posts

    def get_queryset(self):
        """
        Returns blog posts only for the current authenticated user.
        """
        user = self.request.user
        return BlogPost.objects.filter(author=user).order_by('-id')

    def retrieve(self, request, *args, **kwargs):
        """
        Custom logic: increment the view count each time a post is retrieved.
        Only the current user's posts can be retrieved.
        """
        instance = self.get_object()
        instance.views += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_posts(self, request):
        """
        Custom endpoint to fetch blog posts owned by the current authenticated user.
        Accessible at /blogposts/my_posts/
        Since the default queryset already filters by the current user,
        this action is functionally similar to the list endpoint.
        """
        user_posts = self.get_queryset()
        serializer = self.get_serializer(user_posts, many=True)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]  # Adjust permissions as needed

    def get_queryset(self):
        queryset = Comment.objects.all().order_by('-created_at')
        # Filter by the blog_post query parameter if provided, e.g., /comments/?blog_post=1
        blog_post_id = self.request.query_params.get('blog_post')
        if blog_post_id:
            queryset = queryset.filter(blog_post=blog_post_id)
        return queryset
