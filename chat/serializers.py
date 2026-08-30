from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    senderId = serializers.IntegerField(source='sender.id', read_only=True)
    receiverId = serializers.IntegerField(source='receiver.id', read_only=True)
    text = serializers.CharField(source='content')
    timestamp = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'senderId', 'receiverId', 'text', 'timestamp', 'is_read']
