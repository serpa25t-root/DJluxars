from django.db.models import Avg, Count, Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .mail import send_booking_created, send_booking_status_update
from .models import Booking, Review
from .serializers import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'stats':
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        # Filtra según query param o rol, pero vistas dedicadas as-client/as-artist lo hacen
        return Booking.objects.filter(client=user) | Booking.objects.filter(photographer=user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        price = serializer.validated_data.get('price') or serializer.validated_data.get('base_price') or 0
        # Si no viene price, intenta del fotógrafo (no tenemos, usa 0)
        try:
            price = int(price)
        except:
            price = 0
        platform_fee = round(price * 0.10)
        artist_payout = price - platform_fee
        booking = serializer.save(
            client=self.request.user,
            price=price,
            base_price=price,
            platform_fee=platform_fee,
            artist_payout=artist_payout,
            status='pending'
        )
        send_booking_created(booking)
        from notifications.services import notify_booking_created
        notify_booking_created(booking)

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
        send_booking_status_update(booking)
        from notifications.services import notify_booking_status
        notify_booking_status(booking)
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='reject')
    def reject(self, request, pk=None):
        booking = self.get_object()
        if booking.photographer != request.user:
            return Response({'detail': 'No autorizado.'}, status=status.HTTP_403_FORBIDDEN)
        booking.status = 'rejected'
        booking.save()
        send_booking_status_update(booking)
        from notifications.services import notify_booking_status
        notify_booking_status(booking)
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='complete')
    def complete(self, request, pk=None):
        booking = self.get_object()
        if booking.photographer != request.user:
            return Response({'detail': 'No autorizado.'}, status=status.HTTP_403_FORBIDDEN)
        booking.status = 'completed'
        booking.save(update_fields=['status', 'updated_at'])
        return Response(self.get_serializer(booking).data)

    @action(detail=True, methods=['post'], url_path='review')
    def review(self, request, pk=None):
        booking = self.get_object()
        if booking.client != request.user:
            return Response({'detail': 'Solo el cliente puede calificar.'}, status=status.HTTP_403_FORBIDDEN)
        if booking.status != 'completed':
            return Response({'detail': 'La sesión aún no ha finalizado.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            rating = int(request.data.get('rating'))
        except (TypeError, ValueError):
            return Response({'detail': 'La calificación debe ser un número entero.'}, status=status.HTTP_400_BAD_REQUEST)
        if rating < 1 or rating > 5:
            return Response({'detail': 'La calificación debe estar entre 1 y 5.'}, status=status.HTTP_400_BAD_REQUEST)
        review, _ = Review.objects.update_or_create(
            booking=booking,
            defaults={'client': request.user, 'photographer': booking.photographer, 'rating': rating},
        )
        return Response({'id': review.id, 'rating': review.rating})

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        completed = Booking.objects.filter(status='completed').count()
        reviews = Review.objects.all()
        aggregate = reviews.aggregate(average=Avg('rating'), total=Count('id'))
        total_reviews = aggregate['total'] or 0
        satisfied = reviews.filter(rating__gte=4).count()
        return Response({
            'sessions': completed,
            'rating': round(aggregate['average'] or 0, 1),
            'satisfaction': round((satisfied / total_reviews) * 100) if total_reviews else 0,
            'support_hours': 0,
        })
