from rest_framework import serializers
from .models import BlogPost, Comment

class CommentSerializer(serializers.ModelSerializer):
    commenter = serializers.SerializerMethodField(read_only=True)
    replies = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id',
            'blog_post',
            'parent',
            'user',
            'guest_name',
            'guest_email',
            'content',
            'created_at',
            'commenter',
            'replies'
        ]
        read_only_fields = ['created_at', 'commenter', 'replies']

    def get_commenter(self, obj):
        return obj.commenter_display()

    def get_replies(self, obj):
        # Only get replies for top-level comments to avoid infinite recursion
        if obj.parent is None:
            replies = obj.replies.all().order_by('created_at')
            return CommentSerializer(replies, many=True).data
        return []

class BlogPostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 
            'author', 
            'title', 
            'category', 
            'content', 
            'image', 
            'likes', 
            'shares', 
            'views',
            'comments'
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        # Assign the logged-in user as the author if available
        if request and hasattr(request, 'user'):
            validated_data['author'] = request.user
        return super().create(validated_data)
