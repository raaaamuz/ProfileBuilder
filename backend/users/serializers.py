from rest_framework import serializers
from django.contrib.auth import get_user_model


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'bio', 'profile_picture', 'is_public', 'public_token']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = User.objects.filter(username=data['username']).first()
        
        if user and user.check_password(data['password']):
            return {
                "username": data["username"],  # ✅ Ensuring `username` is returned
                "password": data["password"],  # ✅ Ensuring `password` is returned
                "user": UserSerializer(user).data,
            }
        
        raise serializers.ValidationError("Invalid credentials")

from rest_framework import serializers
from .models import UserTabSettings

class UserTabSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTabSettings
        fields = ['settings']
