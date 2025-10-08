from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Item, UserProfile, Notification 
from rest_framework.validators import UniqueValidator


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'reference_id', 'message', 'is_read', 'created_at']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["photo_url",'City','Bio','notifications_enabled'] 

class UserCreateSerializer(serializers.ModelSerializer): 
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )  
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
        }
    def create(self, validated_data):
        email = validated_data.get("email")
        validated_data["username"] = email
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        return user

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='userprofile', required=False) 
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "password", "profile"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
        }

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('userprofile', {})
        password = validated_data.pop('password', None)
        
        if 'email' in validated_data:
            instance.username = validated_data['email']
        if password:
            instance.set_password(password)

        user = super().update(instance, validated_data) 
        if profile_data:
            profile_instance = user.userprofile 
            
            for attr, value in profile_data.items():
                setattr(profile_instance, attr, value)
            
            profile_instance.save()
        
            if profile_instance.notifications_enabled:
                Notification.objects.create(
                    user=user,
                    notification_type='profile',
                    message='Seu perfil e dados básicos foram atualizados!'
                )
        return user
    
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

    def create(self, validated_data):
        item = Item.objects.create(**validated_data)
        return item



