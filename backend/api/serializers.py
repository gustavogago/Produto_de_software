from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Category, City, Item, Notification, UserProfile


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'state']


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
    category_name = serializers.CharField(source='category.name', read_only=True)
    city = CitySerializer(read_only=True)
    photos = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()  # Para compatibilidade com o frontend
    type = serializers.CharField(default='Trade')  # Sell, Trade, ou Donation
    
    class Meta:
        model = Item
        fields = ['id', 'title', 'description', 'category', 'category_name', 
                 'city', 'status', 'listing_state', 'created_at', 
                 'updated_at', 'photos', 'images', 'type']
        read_only_fields = ['user', 'id', 'created_at', 'updated_at']

    def get_photos(self, obj):
        return [photo.url for photo in obj.photos.all()]
        
    def get_images(self, obj):
        # Para manter compatibilidade com o frontend que espera 'images'
        return self.get_photos(obj)

    def get_photos(self, obj):
        return [photo.url for photo in obj.photos.all()]

    def create(self, validated_data):
        item = Item.objects.create(**validated_data)
        return item



