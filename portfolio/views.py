from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.utils import timezone
from .models import PortfolioItem
from .serializers import PortfolioItemSerializer

class PortfolioViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        user = self.request.user
        return PortfolioItem.objects.filter(owner=user)

    def perform_create(self, serializer):
        user = self.request.user
        # Validación de cuotas Free vs Pro
        # Free: 15 fotos, 2 videos, 6 servicios (simulamos servicios como portfolio items totales)
        # Por ahora aplicamos cuota mensual por mes actual
        now = timezone.now()
        month_items = PortfolioItem.objects.filter(owner=user, created_at__year=now.year, created_at__month=now.month)
        # Determina plan: si user tiene atributo is_pro o plan, sino free
        is_pro = getattr(user, 'is_pro', False) or getattr(user, 'plan', 'free') == 'pro'
        # También revisa header opcional X-Plan: PRO para demo
        if self.request.headers.get('X-Plan') == 'PRO':
            is_pro = True

        limits = {'photos': 30, 'videos': 4, 'services': 6} if is_pro else {'photos': 15, 'videos': 2, 'services': 3}

        media_type = self.request.data.get('media_type', 'imagen')
        key = 'videos' if media_type == 'video' else 'photos'
        count = month_items.filter(media_type=key if key == 'videos' else 'imagen').count() if key == 'videos' else month_items.exclude(media_type='video').count()

        # Si supera, devuelve 400 con mensaje que frontend espera para UpgradeModal
        if count >= limits[key]:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'detail': f'Has alcanzado el límite de {limits[key]} {key} de tu Plan {"PRO" if is_pro else "Free"}.'})

        # También valida servicios activos (total items del mes)
        total = month_items.count()
        if total >= limits['services'] and False:
            # Desactivado para no bloquear portfolio por servicios, solo media
            pass

        serializer.save(owner=user)
