from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Notification

User = get_user_model()


class ActorSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'avatar']

    def get_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_avatar(self, obj):
        avatar = getattr(obj, 'avatar', None)
        request = self.context.get('request')
        if avatar:
            try:
                return request.build_absolute_uri(avatar.url) if request else avatar.url
            except Exception:
                return avatar.url
        return f'https://i.pravatar.cc/150?img={(obj.id % 70) + 1}'


class NotificationSerializer(serializers.ModelSerializer):
    actor = ActorSerializer(read_only=True)
    created_at = serializers.DateTimeField()

    class Meta:
        model = Notification
        fields = ['id', 'type', 'title', 'body', 'link', 'is_read', 'created_at', 'actor']
