from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from portfolio.models import PortfolioItem
from bookings.models import Booking
from bookings.serializers import BookingSerializer
from payments.models import Payment
from payments.serializers import PaymentSerializer

from .permissions import IsAdminRole
from .serializers import AdminUserSerializer, AdminWorkSerializer

User = get_user_model()


class AdminUserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminRole]
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = AdminUserSerializer
    http_method_names = ['get', 'patch', 'post', 'head', 'options']

    def get_queryset(self):
        qs = super().get_queryset()
        role = self.request.query_params.get('role')
        if role:
            qs = qs.filter(role=role)
        q = self.request.query_params.get('q')
        if q:
            qs = qs.filter(Q(username__icontains=q) | Q(email__icontains=q) |
                           Q(first_name__icontains=q) | Q(last_name__icontains=q))
        return qs

    @action(detail=True, methods=['post'], url_path='toggle-active')
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        user.is_suspended = not user.is_suspended
        user.save(update_fields=['is_suspended'])
        return Response({'id': user.id, 'is_suspended': user.is_suspended, 'is_active': user.is_active})

    @action(detail=True, methods=['post'], url_path='set-role')
    def set_role(self, request, pk=None):
        user = self.get_object()
        role = request.data.get('role')
        if role not in ('client', 'artist', 'admin'):
            return Response({'detail': 'Rol inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        user.role = role
        if role == 'admin':
            user.is_staff = True
        user.save(update_fields=['role', 'is_staff'])
        return Response({'id': user.id, 'role': user.role, 'is_staff': user.is_staff})

    @action(detail=True, methods=['post'], url_path='clear-portfolio')
    def clear_portfolio(self, request, pk=None):
        user = self.get_object()
        items = PortfolioItem.objects.filter(owner=user)
        count = items.count()
        for it in items:
            if it.image:
                it.image.delete(save=False)
            if it.file:
                it.file.delete(save=False)
        items.delete()
        from notifications.services import notify
        notify(
            recipient=user,
            title='Portafolio eliminado',
            body='El administrador eliminó tu portafolio completo. Ya no es visible públicamente.',
            notif_type='contenido',
            link='/dashboard/portfolio',
        )
        return Response({'deleted': count, 'user': user.id})


class AdminWorkViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminRole]
    queryset = PortfolioItem.objects.select_related('owner').all().order_by('-created_at')
    serializer_class = AdminWorkSerializer
    http_method_names = ['get', 'patch', 'post', 'head', 'options']

    def get_queryset(self):
        qs = super().get_queryset()
        st = self.request.query_params.get('status')
        if st:
            qs = qs.filter(status=st)
        q = self.request.query_params.get('q')
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(owner__username__icontains=q) |
                           Q(owner__email__icontains=q))
        return qs

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        item = self.get_object()
        item.status = PortfolioItem.Status.APPROVED
        item.moderation_reason = ''
        item.save(update_fields=['status', 'moderation_reason'])
        from notifications.services import notify_content_status
        notify_content_status(item, approved=True)
        return Response(self.get_serializer(item).data)

    @action(detail=True, methods=['post'], url_path='reject')
    def reject(self, request, pk=None):
        item = self.get_object()
        reason = request.data.get('reason') or 'Contenido +18 o que infringe las normas de la plataforma.'
        item.status = PortfolioItem.Status.REJECTED
        item.moderation_reason = reason
        item.save(update_fields=['status', 'moderation_reason'])
        from notifications.services import notify_content_status
        notify_content_status(item, approved=False)
        return Response(self.get_serializer(item).data)


class AdminBookingViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAdminRole]
    queryset = Booking.objects.select_related('client', 'photographer').all().order_by('-created_at')
    serializer_class = BookingSerializer


class AdminPaymentViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAdminRole]
    queryset = Payment.objects.select_related('client', 'booking').all().order_by('-created_at')
    serializer_class = PaymentSerializer


from rest_framework.views import APIView


class AdminStatsAPIView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        return Response({
            'users': User.objects.count(),
            'artists': User.objects.filter(role='artist').count(),
            'clients': User.objects.filter(role='client').count(),
            'admins': User.objects.filter(role='admin').count(),
            'works': PortfolioItem.objects.count(),
            'works_rejected': PortfolioItem.objects.filter(status='rechazado').count(),
            'bookings': Booking.objects.count(),
            'bookings_pending': Booking.objects.filter(status='pending').count(),
            'payments': Payment.objects.count(),
            'revenue': Payment.objects.filter(status='success').aggregate(total=__import__('django.db.models', fromlist=['Sum']).Sum('amount'))['total'] or 0,
        })
