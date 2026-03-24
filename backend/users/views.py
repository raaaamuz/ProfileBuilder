import logging
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import authenticate, get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings as django_settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.db.models import Count
from django.db.models.functions import TruncDate

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import AllowAny
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    UserTabSettingsSerializer,
)
from .models import UserTabSettings

User = get_user_model()


def send_verification_email(user):
    """Send email verification link to user"""
    verification_url = f"{django_settings.FRONTEND_URL}/verify-email/{user.email_verification_token}"

    subject = "Verify your Profile2Connect account"
    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #0a1628; color: #ffffff; padding: 40px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e3a5f; border-radius: 10px; padding: 30px;">
            <h1 style="color: #00b4d8; text-align: center;">Welcome to Profile2Connect!</h1>
            <p style="font-size: 16px; line-height: 1.6;">Hi {user.username},</p>
            <p style="font-size: 16px; line-height: 1.6;">Thank you for registering! Please verify your email address to activate your account.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{verification_url}"
                   style="background: linear-gradient(to right, #00b4d8, #4facfe);
                          color: white;
                          padding: 15px 30px;
                          text-decoration: none;
                          border-radius: 8px;
                          font-weight: bold;
                          display: inline-block;">
                    Verify Email Address
                </a>
            </div>
            <p style="font-size: 14px; color: #a0aec0;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #00b4d8; word-break: break-all;">{verification_url}</p>
            <hr style="border-color: #2d4a6f; margin: 30px 0;">
            <p style="font-size: 12px; color: #a0aec0; text-align: center;">
                If you didn't create an account, you can safely ignore this email.
            </p>
        </div>
    </body>
    </html>
    """
    plain_message = strip_tags(html_message)

    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=django_settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        user.email_verification_sent_at = timezone.now()
        user.save(update_fields=['email_verification_sent_at'])
        return True
    except Exception as e:
        logger.error(f"Failed to send verification email to {user.email}: {str(e)}")
        return False

# Configure the logger
logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def register(request):
    """Registers a new user and sends verification email"""
    from django.db import IntegrityError

    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
        except IntegrityError as e:
            error_msg = str(e).lower()
            if 'username' in error_msg:
                return Response({
                    "username": ["This username is already taken. Please choose another."]
                }, status=status.HTTP_400_BAD_REQUEST)
            elif 'email' in error_msg:
                return Response({
                    "email": ["This email is already registered. Please use another or login."]
                }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    "error": "Registration failed. Username or email may already exist."
                }, status=status.HTTP_400_BAD_REQUEST)

        # Auto-verify in localhost/development mode
        if django_settings.DEBUG:
            user.is_active = True
            user.is_email_verified = True
            user.save()
            return Response({
                "message": "Registration successful! (Auto-verified in development mode)",
                "email_sent": False,
                "user": UserSerializer(user).data,
            }, status=status.HTTP_201_CREATED)

        user.is_active = False  # User cannot login until email is verified
        user.save()

        # Send verification email
        email_sent = send_verification_email(user)

        return Response({
            "message": "Registration successful! Please check your email to verify your account.",
            "email_sent": email_sent,
            "user": UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, token):
    """Verify user email with token"""
    try:
        user = User.objects.get(email_verification_token=token)

        if user.is_email_verified:
            return Response({
                "message": "Email already verified. You can login now.",
                "already_verified": True
            }, status=status.HTTP_200_OK)

        user.is_email_verified = True
        user.is_active = True  # Activate the user account
        user.save(update_fields=['is_email_verified', 'is_active'])

        return Response({
            "message": "Email verified successfully! You can now login.",
            "verified": True
        }, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({
            "error": "Invalid verification link."
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification(request):
    """Resend verification email"""
    email = request.data.get('email')

    if not email:
        return Response({
            "error": "Email is required."
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)

        if user.is_email_verified:
            return Response({
                "message": "Email is already verified. You can login.",
                "already_verified": True
            }, status=status.HTTP_200_OK)

        # Generate new token and send email
        user.generate_new_verification_token()
        email_sent = send_verification_email(user)

        return Response({
            "message": "Verification email sent! Please check your inbox.",
            "email_sent": email_sent
        }, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        # Don't reveal if email exists or not for security
        return Response({
            "message": "If an account exists with this email, a verification link has been sent."
        }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_username(request):
    user = request.user
    logger.info(f"Get username request for user: {user.username}")
    return Response({"username": user.username})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_account_info(request):
    """Return full account info including registration date"""
    user = request.user
    from profiles.models import UserProfile

    profile = UserProfile.objects.filter(user=user).first()

    return Response({
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "full_name": f"{user.first_name} {user.last_name}".strip() or user.username,
        "date_joined": user.date_joined.isoformat(),
        "last_login": user.last_login.isoformat() if user.last_login else None,
        "is_verified": user.is_email_verified if hasattr(user, 'is_email_verified') else True,
        "profile": {
            "phone": profile.phone if profile else None,
            "location": profile.location if profile else None,
            "bio": profile.bio if profile else None,
            "cv_uploaded": bool(profile.cv) if profile else False,
            "onboarding_completed": profile.onboarding_completed if profile else False,
        } if profile else None
    })


@api_view(["POST"])
def login(request):
    """Handles user login and returns an access token"""
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        user = authenticate(
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"]
        )

        if user:
            access_token = AccessToken.for_user(user)  # ✅ Generate only access token
            return Response({
                "access": str(access_token),  # ✅ No refresh token
                "user": UserSerializer(user).data,
            }, status=status.HTTP_200_OK)

    return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def public_profile(request, public_token):
    try:
        user = User.objects.get(public_token=public_token, is_public=True)
        logger.info(f"Public profile accessed for user: {user.username}")
        return Response(UserSerializer(user).data)
    except User.DoesNotExist:
        logger.error("Profile is private or does not exist")
        return Response({"error": "Profile is private or does not exist"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tab_settings(request):
    user = request.user
    settings, created = UserTabSettings.objects.get_or_create(user=user, defaults={"settings": {}})
    serializer = UserTabSettingsSerializer(settings)
    logger.info(f"Get tab settings for user: {user.username}")
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """Send password reset email"""
    email = request.data.get('email')

    if not email:
        return Response({
            "error": "Email is required."
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)

        # Generate a new token for password reset (reuse verification token)
        user.generate_new_verification_token()

        # Send password reset email
        reset_url = f"{django_settings.FRONTEND_URL}/reset-password/{user.email_verification_token}"

        subject = "Reset your Profile2Connect password"
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #0a1628; color: #ffffff; padding: 40px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #1e3a5f; border-radius: 10px; padding: 30px;">
                <h1 style="color: #00b4d8; text-align: center;">Password Reset Request</h1>
                <p style="font-size: 16px; line-height: 1.6;">Hi {user.username},</p>
                <p style="font-size: 16px; line-height: 1.6;">We received a request to reset your password. Click the button below to create a new password.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_url}"
                       style="background: linear-gradient(to right, #00b4d8, #4facfe);
                              color: white;
                              padding: 15px 30px;
                              text-decoration: none;
                              border-radius: 8px;
                              font-weight: bold;
                              display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="font-size: 14px; color: #a0aec0;">If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="font-size: 12px; color: #00b4d8; word-break: break-all;">{reset_url}</p>
                <hr style="border-color: #2d4a6f; margin: 30px 0;">
                <p style="font-size: 12px; color: #a0aec0; text-align: center;">
                    If you didn't request a password reset, you can safely ignore this email.
                </p>
            </div>
        </body>
        </html>
        """
        plain_message = strip_tags(html_message)

        send_mail(
            subject=subject,
            message=plain_message,
            from_email=django_settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )

        return Response({
            "message": "Password reset link sent to your email."
        }, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        # Don't reveal if email exists for security
        return Response({
            "message": "If an account exists with this email, a password reset link has been sent."
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Failed to send password reset email: {str(e)}")
        return Response({
            "error": "Failed to send email. Please try again later."
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request, token):
    """Reset password with token"""
    new_password = request.data.get('password')

    if not new_password:
        return Response({
            "error": "Password is required."
        }, status=status.HTTP_400_BAD_REQUEST)

    if len(new_password) < 6:
        return Response({
            "error": "Password must be at least 6 characters."
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email_verification_token=token)

        user.set_password(new_password)
        user.generate_new_verification_token()  # Invalidate the token after use
        user.save()

        return Response({
            "message": "Password reset successfully. You can now login with your new password."
        }, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({
            "error": "Invalid or expired reset link."
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_tab_settings(request):
    """Update user settings"""
    user = request.user
    logger.info(f"Updating tab settings for user: {user.username}")
    logger.info(f"Request data: {request.data}")

    settings_obj, created = UserTabSettings.objects.get_or_create(user=user)

    # Get the settings from request data
    new_settings = request.data.get('settings', {})

    # Update the settings JSON field directly
    settings_obj.settings = new_settings
    settings_obj.save()

    logger.info(f"Saved settings: {settings_obj.settings}")

    serializer = UserTabSettingsSerializer(settings_obj)
    return Response({"message": "Settings updated successfully!", "settings": serializer.data})


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard(request):
    """Admin dashboard statistics"""
    now = timezone.now()
    today = now.date()
    last_7_days = today - timedelta(days=7)
    last_30_days = today - timedelta(days=30)

    # Total counts
    total_users = User.objects.count()
    verified_users = User.objects.filter(is_email_verified=True).count()
    active_users = User.objects.filter(is_active=True).count()
    staff_users = User.objects.filter(is_staff=True).count()

    # Recent registrations
    registrations_today = User.objects.filter(date_joined__date=today).count()
    registrations_7_days = User.objects.filter(date_joined__date__gte=last_7_days).count()
    registrations_30_days = User.objects.filter(date_joined__date__gte=last_30_days).count()

    # Recent logins (users who logged in)
    logins_today = User.objects.filter(last_login__date=today).count()
    logins_7_days = User.objects.filter(last_login__date__gte=last_7_days).count()
    logins_30_days = User.objects.filter(last_login__date__gte=last_30_days).count()

    # Registration trend (last 30 days)
    registration_trend = (
        User.objects.filter(date_joined__date__gte=last_30_days)
        .annotate(date=TruncDate('date_joined'))
        .values('date')
        .annotate(count=Count('id'))
        .order_by('date')
    )

    # Login trend (last 30 days)
    login_trend = (
        User.objects.filter(last_login__date__gte=last_30_days)
        .annotate(date=TruncDate('last_login'))
        .values('date')
        .annotate(count=Count('id'))
        .order_by('date')
    )

    # Recent users list
    recent_users = User.objects.order_by('-date_joined')[:10].values(
        'id', 'username', 'email', 'is_email_verified', 'is_active', 'date_joined', 'last_login'
    )

    # Frequent users (most logins - users who logged in recently)
    frequent_users = User.objects.filter(last_login__isnull=False).order_by('-last_login')[:10].values(
        'id', 'username', 'email', 'last_login', 'date_joined'
    )

    return Response({
        'summary': {
            'total_users': total_users,
            'verified_users': verified_users,
            'active_users': active_users,
            'staff_users': staff_users,
        },
        'registrations': {
            'today': registrations_today,
            'last_7_days': registrations_7_days,
            'last_30_days': registrations_30_days,
        },
        'logins': {
            'today': logins_today,
            'last_7_days': logins_7_days,
            'last_30_days': logins_30_days,
        },
        'registration_trend': list(registration_trend),
        'login_trend': list(login_trend),
        'recent_users': list(recent_users),
        'frequent_users': list(frequent_users),
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def activate_all_users_dev(request):
    """
    DEV ONLY: Activate all users without email verification.
    Only works when DEBUG=True.
    """
    if not django_settings.DEBUG:
        return Response({
            "error": "This endpoint is only available in development mode."
        }, status=status.HTTP_403_FORBIDDEN)

    # Activate all inactive/unverified users
    updated_count = User.objects.filter(is_active=False).update(is_active=True)
    verified_count = User.objects.filter(is_email_verified=False).update(is_email_verified=True)

    return Response({
        "message": f"Development mode: Activated {updated_count} users, verified {verified_count} emails.",
        "activated": updated_count,
        "verified": verified_count,
    })
