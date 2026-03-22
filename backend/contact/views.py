from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactMessage
from .serializers import ContactMessageSerializer, ContactSubmitSerializer

User = get_user_model()


def send_contact_notification(to_user, contact_data):
    """Send email notification when someone contacts a user"""
    try:
        subject = f"New Contact Message: {contact_data.get('subject', 'No Subject')}"

        message = f"""
Hi {to_user.first_name or to_user.username},

You have received a new message on your Profile2Connect profile.

From: {contact_data['firstName']} {contact_data['lastName']}
Email: {contact_data['email']}
Subject: {contact_data.get('subject', 'No Subject')}

Message:
{contact_data['message']}

---
You can view and reply to this message in your inbox:
https://profile2connect.com/dashboard/inbox

Best regards,
Profile2Connect Team
"""

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_user.email],
            fail_silently=True,  # Don't break if email fails
        )
    except Exception as e:
        print(f"Failed to send contact notification email: {e}")


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def submit_contact(request):
    """Public endpoint to submit a contact message"""
    serializer = ContactSubmitSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    username = data.get('to_user')

    # Find the recipient user
    if username:
        try:
            to_user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    else:
        # If no username specified, send to first admin/superuser
        to_user = User.objects.filter(is_superuser=True).first()
        if not to_user:
            to_user = User.objects.first()

    if not to_user:
        return Response({'error': 'No recipient found'}, status=status.HTTP_400_BAD_REQUEST)

    # Create the contact message
    ContactMessage.objects.create(
        to_user=to_user,
        first_name=data['firstName'],
        last_name=data['lastName'],
        email=data['email'],
        subject=data.get('subject', ''),
        message=data['message']
    )

    # Send email notification to the profile owner
    if to_user.email:
        send_contact_notification(to_user, data)

    return Response({'success': True, 'message': 'Message sent successfully'})


class InboxView(APIView):
    """View inbox messages for authenticated user"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get all messages for the authenticated user"""
        messages = ContactMessage.objects.filter(to_user=request.user)
        serializer = ContactMessageSerializer(messages, many=True)

        # Count unread messages
        unread_count = messages.filter(is_read=False).count()

        return Response({
            'messages': serializer.data,
            'unread_count': unread_count,
            'total_count': messages.count()
        })


class MessageDetailView(APIView):
    """View and manage individual messages"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """Get a specific message and mark as read"""
        try:
            message = ContactMessage.objects.get(pk=pk, to_user=request.user)
            message.is_read = True
            message.save()
            serializer = ContactMessageSerializer(message)
            return Response(serializer.data)
        except ContactMessage.DoesNotExist:
            return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        """Delete a message"""
        try:
            message = ContactMessage.objects.get(pk=pk, to_user=request.user)
            message.delete()
            return Response({'success': True, 'message': 'Message deleted'})
        except ContactMessage.DoesNotExist:
            return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_as_read(request, pk):
    """Mark a message as read"""
    try:
        message = ContactMessage.objects.get(pk=pk, to_user=request.user)
        message.is_read = True
        message.save()
        return Response({'success': True})
    except ContactMessage.DoesNotExist:
        return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_all_read(request):
    """Mark all messages as read"""
    ContactMessage.objects.filter(to_user=request.user, is_read=False).update(is_read=True)
    return Response({'success': True, 'message': 'All messages marked as read'})
