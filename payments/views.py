import uuid

from django.db import transaction
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from bookings.models import Booking
from notifications.services import notify

from .models import Payment
from .serializers import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Cliente ve sus pagos; fotógrafo ve los pagos de sus reservas
        if user.role == 'artist':
            return Payment.objects.filter(booking__photographer=user)
        return Payment.objects.filter(client=user)

    def create(self, request, *args, **kwargs):
        booking_id = request.data.get('booking_id')
        method = request.data.get('method', 'tarjeta')
        try:
            booking = Booking.objects.get(id=booking_id)
        except (Booking.DoesNotExist, TypeError, ValueError):
            return Response({'detail': 'Reserva no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        if booking.client != request.user:
            return Response({'detail': 'No autorizado.'}, status=status.HTTP_403_FORBIDDEN)

        if hasattr(booking, 'payment'):
            return Response({'detail': 'Esta reserva ya tiene un pago.'}, status=status.HTTP_400_BAD_REQUEST)

        if booking.status not in ('accepted', 'Confirmada', 'completed', 'Finalizada', 'pending', 'Pendiente'):
            return Response({'detail': 'La reserva no admite pago en este estado.'}, status=status.HTTP_400_BAD_REQUEST)

        amount = booking.price or booking.base_price or 0
        platform_fee = booking.platform_fee or round(amount * 0.10)
        artist_payout = booking.artist_payout or (amount - platform_fee)

        with transaction.atomic():
            payment = Payment.objects.create(
                booking=booking,
                client=request.user,
                amount=amount,
                platform_fee=platform_fee,
                artist_payout=artist_payout,
                method=method,
                status=Payment.Status.PENDING,
            )
            # Pasarela FICTICIA: aprueba el pago en el acto
            payment.status = Payment.Status.SUCCESS
            payment.paid_at = timezone_now()
            payment.save(update_fields=['status', 'paid_at'])

        # Notificaciones
        notify(
            recipient=booking.photographer,
            actor=request.user,
            title='Pago recibido',
            body=f'{request.user.get_full_name() or request.user.username} pagó '
                 f'${amount:,} COP por «{booking.service}». Tu pago: ${artist_payout:,} COP.',
            notif_type='reserva',
            link='/dashboard/bookings',
        )
        notify(
            recipient=request.user,
            title='Pago aprobado',
            body=f'Transacción {str(payment.transaction_id)[:8]} aprobada. Total: ${amount:,} COP.',
            notif_type='reserva',
            link='/my-bookings',
        )

        serializer = self.get_serializer(payment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='by-booking/(?P<booking_id>[^/.]+)')
    def by_booking(self, request, booking_id=None):
        try:
            payment = Payment.objects.get(booking_id=booking_id)
        except Payment.DoesNotExist:
            return Response({'detail': 'Sin pago.'}, status=status.HTTP_404_NOT_FOUND)
        # Solo cliente de la reserva o el fotógrafo pueden verlo
        booking = payment.booking
        if request.user not in (booking.client, booking.photographer):
            return Response({'detail': 'No autorizado.'}, status=status.HTTP_403_FORBIDDEN)
        return Response(self.get_serializer(payment).data)


def timezone_now():
    from django.utils import timezone as tz
    return tz.now()
