from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.contrib.auth import get_user_model
from django.db.models import Q, Max, Count
from django.utils.html import strip_tags
import html
from .models import Message
from .serializers import MessageSerializer

User = get_user_model()

class ConversationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        # Último mensaje de cada conversación (más reciente primero)
        messages = (
            Message.objects
            .filter(Q(sender=user) | Q(receiver=user))
            .select_related('sender', 'receiver')
            .order_by('-timestamp')
        )

        contacts = {}
        for m in messages:
            other = m.receiver if m.sender_id == user.id else m.sender
            if other.id in contacts:
                continue  # ya tenemos el mensaje más reciente de ese contacto
            contacts[other.id] = {
                'profile': {
                    'id': str(other.id),
                    'name': other.get_full_name() or other.username,
                    'avatar': _avatar_url(other, request),
                    'specialty': other.get_role_display(),
                    'online': other.is_active,
                },
                'lastMessage': m.content,
                'updatedAt': m.timestamp.isoformat(),
            }

        # Conteo de no leídos por contacto
        unread_qs = (
            Message.objects
            .filter(receiver=user, is_read=False)
            .values('sender')
            .annotate(cnt=Count('id'))
        )
        unread_map = {entry['sender']: entry['cnt'] for entry in unread_qs}

        result = []
        for cid, data in contacts.items():
            result.append({
                'id': str(cid),
                'contact': data['profile'],
                'lastMessage': data['lastMessage'],
                'unread': unread_map.get(int(cid), 0),
                'updatedAt': data['updatedAt'],
            })
        result.sort(key=lambda x: x['updatedAt'], reverse=True)
        return Response(result)


def _avatar_url(user, request):
    """Avatar real del usuario (con URL absoluta) o placeholder determinista."""
    avatar = getattr(user, 'avatar', None)
    if avatar:
        try:
            return request.build_absolute_uri(avatar.url) if request else avatar.url
        except Exception:
            return avatar.url
    return f'https://i.pravatar.cc/150?img={(user.id % 70) + 1}'


class MessagesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, userId):
        try:
            other = User.objects.get(id=userId)
        except User.DoesNotExist:
            return Response({'detail': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        user = request.user
        qs = Message.objects.filter(
            (Q(sender=user) & Q(receiver=other)) | (Q(sender=other) & Q(receiver=user))
        ).order_by('timestamp')
        # Marca como leídos los recibidos
        Message.objects.filter(sender=other, receiver=user, is_read=False).update(is_read=True)
        serializer = MessageSerializer(qs, many=True)
        # Normaliza a formato frontend (senderId como 'me' o id)
        data = []
        for m in serializer.data:
            is_me = m['senderId'] == user.id
            data.append({
                'id': m['id'],
                'senderId': 'me' if is_me else str(m['senderId']),
                'text': m['text'],
                'timestamp': m['timestamp'],
                'is_read': m['is_read'],
            })
        return Response(data)


class SendMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        receiver_id = request.data.get('receiver_id')
        content = request.data.get('content')
        if not receiver_id or not content:
            return Response({'detail': 'receiver_id y content requeridos.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({'detail': 'Receptor no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        clean_content = strip_tags(html.escape(str(content)))[:2000]
        msg = Message.objects.create(sender=request.user, receiver=receiver, content=clean_content)

        # Notificación in-app para el receptor (aparece en la campana del dashboard)
        try:
            from notifications.services import notify_new_message
            notify_new_message(msg)
        except Exception:
            pass
        serializer = MessageSerializer(msg)
        return Response({
            'id': msg.id,
            'senderId': 'me',
            'text': msg.content,
            'timestamp': msg.timestamp.isoformat(),
        }, status=status.HTTP_201_CREATED)
