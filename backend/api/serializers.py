from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Item, UserProfile, Notification 



class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'reference_id', 'message', 'is_read', 'created_at']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["photo_url",'City','Bio','notifications_enabled'] 


#faz a conversão para json
class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "password","profile"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
        }

    def create(self, validated_data):
        email = validated_data.get("email")
        validated_data["username"] = email
        user = User.objects.create_user(**validated_data)
        return user
    
    #Função para realizar a edição dos dados de cada user
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        password = validated_data.pop('password', None)
        
        if 'email' in validated_data:
            instance.username = validated_data['email']
        if password:
            instance.set_password(password)

        user = super().update(instance, validated_data) 

        profile_instance, created = UserProfile.objects.get_or_create(user=user)
        for attr, value in profile_data.items():
            setattr(profile_instance, attr, value)
        profile_instance.save()

        if profile_instance.notifications_enabled:
            Notification.objects.create(
                user=user,
                notification_type='profile',
                message='Seu perfil foi atualizado com sucesso!'
            )


        
        return user 

#cria um sinalizador para o modelo item
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

    def create(self, validated_data):
        item = Item.objects.create(**validated_data)
        return item



