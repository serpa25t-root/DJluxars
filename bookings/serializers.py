from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    photographer_name = serializers.CharField(source='photographer.username', read_only=True)
    client_name = serializers.CharField(source='client.username', read_only=True)
    photographerId = serializers.IntegerField(source='photographer.id', read_only=True)
    clientEmail = serializers.CharField(source='client.email', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'photographer', 'photographer_name', 'photographerId', 'client', 'client_name', 'clientEmail',
            'date', 'service', 'location', 'message', 'price', 'base_price', 'platform_fee', 'artist_payout', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'platform_fee', 'artist_payout', 'base_price', 'status', 'created_at']
        extra_kwargs = {
            'photographer': {'required': True},
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Normaliza status a español para frontend
        status_map = {'pending': 'Pendiente', 'accepted': 'Confirmada', 'rejected': 'Rechazada', 'completed': 'Finalizada'}
        data['status'] = status_map.get(data['status'], data['status'])
        return data
