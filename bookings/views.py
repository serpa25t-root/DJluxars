from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Filtra según query param o rol, pero vistas dedicadas as-client/as-artist lo hacen
        return Booking.objects.filter(client=user) | Booking.objects.filter(photographer=user)

    def perform_create(self, serializer):
        price = serializer.validated_data.get('price') or serializer.validated_data.get('base_price') or 0
        # Si no viene price, intenta del fotógrafo (no tenemos, usa 0)
        try:
            price = int(price)
        except:
            price = 0
        platform_fee = round(price * 0.10)
        artist_payout = price - platform_fee
        serializer.save(
            client=self.request.user,
            price=price,
            base_price=price,
            platform_fee=platform_fee,
            artist_payout=artist_payout,
            status='pending'
        )

    @action(detail=False, methods=['get'], url_path='as-client')
    def as_client(self, request):
        qs = Booking.objects.filter(client=request.user)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='as-artist')
    def as_artist(self, request):
        qs = Booking.objects.filter(photographer=request.user)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='accept')
    def accept(self, request, pk=None):
        booking = self.get_object()
        # Solo el fotógrafo puede aceptar
        if booking.photographer != request.user:
            return Response({'detail': 'No autorizado.'}, status=status.HTTP_403_FORBIDDEN)
        booking.status = 'accepted'
        booking.save()
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='reject')
    def reject(self, request, pk=None):
        booking = self.get_object()
        if booking.photographer != request.user:
            return Response({'detail': 'No autorizado.'}, status=status.HTTP_403_FORBIDDEN)
        booking.status = 'rejected'
        booking.save()
        serializer = self.get_serializer(booking)
        return Response(serializer.data)
