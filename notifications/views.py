from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer


class NotificationsView(APIView):
    """Lista las notificaciones del usuario autenticado (más recientes primero)."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = request.user.notifications.all()
        limit = request.query_params.get('limit')
        try:
            limit = max(1, min(int(limit), 100)) if limit else 30
        except (TypeError, ValueError):
            limit = 30
        serializer = NotificationSerializer(qs[:limit], many=True, context={'request': request})
        unread = request.user.notifications.filter(is_read=False).count()
        return Response({'results': serializer.data, 'unread': unread})

    def delete(self, request):
        """Borra todas las notificaciones del usuario."""
        deleted, _ = request.user.notifications.all().delete()
        return Response({'deleted': deleted}, status=status.HTTP_200_OK)


class UnreadCountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({'count': request.user.notifications.filter(is_read=False).count()})


class MarkReadView(APIView):
    """Marca como leídas una por id ({ids: [1,2]}) o todas ({all: true})."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        qs = request.user.notifications.filter(is_read=False)
        if request.data.get('all'):
            updated = qs.update(is_read=True)
            return Response({'updated': updated})

        ids = request.data.get('ids') or []
        if isinstance(ids, (int, str)):
            ids = [ids]
        try:
            ids = [int(i) for i in ids]
        except (TypeError, ValueError):
            return Response({'detail': 'ids inválidos.'}, status=status.HTTP_400_BAD_REQUEST)

        updated = qs.filter(id__in=ids).update(is_read=True)
        return Response({'updated': updated})
