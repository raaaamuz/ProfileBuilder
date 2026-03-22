from rest_framework import serializers
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()

    class Meta:
        model = ContactMessage
        fields = ['id', 'first_name', 'last_name', 'email', 'subject', 'message', 'is_read', 'created_at', 'sender_name']
        read_only_fields = ['id', 'created_at', 'sender_name']

    def get_sender_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

class ContactSubmitSerializer(serializers.Serializer):
    firstName = serializers.CharField(max_length=100)
    lastName = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=255, required=False, allow_blank=True)
    message = serializers.CharField()
    to_user = serializers.CharField(required=False, allow_null=True)
