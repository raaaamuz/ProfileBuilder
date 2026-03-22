from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
User = get_user_model()

@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_username(request):
    user = request.user
    return Response({"username": user.username})

@api_view(['POST'])
def login(request):
    print("Request Data Received:", request.data)  # Debugging Step

    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        print("Serializer Errors:", serializer.errors)  # Debugging Step
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    validated_data = serializer.validated_data
    print("Validated Data:", validated_data)  # Debugging Step

    user = authenticate(username=validated_data["username"], password=validated_data["password"])
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data
        })

    return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)



@api_view(['GET'])
def public_profile(request, public_token):
    try:
        user = User.objects.get(public_token=public_token, is_public=True)
        return Response(UserSerializer(user).data)
    except User.DoesNotExist:
        return Response({"error": "Profile is private or does not exist"}, status=404)
    


from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UserTabSettings
from .serializers import UserTabSettingsSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tab_settings(request):
    user = request.user
    settings, created = UserTabSettings.objects.get_or_create(user=user, defaults={"settings": {}})
    serializer = UserTabSettingsSerializer(settings)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_tab_settings(request):
    user = request.user
    settings, created = UserTabSettings.objects.get_or_create(user=user)

    serializer = UserTabSettingsSerializer(settings, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Settings updated successfully!", "settings": serializer.data})

    return Response(serializer.errors, status=400)
