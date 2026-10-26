from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    transaction_id = serializers.CharField(read_only=True)
    booking_id = serializers.IntegerField(source='booking.id', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'booking', 'booking_id', 'client', 'amount', 'platform_fee',
            'artist_payout', 'method', 'status', 'transaction_id', 'created_at', 'paid_at',
        ]
        read_only_fields = ['id', 'client', 'amount', 'platform_fee', 'artist_payout',
                            'status', 'transaction_id', 'created_at', 'paid_at', 'booking_id']
