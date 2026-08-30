from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.contrib.auth import get_user_model
from django.db.models import Q, Max, Count
from .models import Message
from .serializers import MessageSerializer

User = get_user_model()

class ConversationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        # Obtiene todos los usuarios con los que hay mensajes
        messages = Message.objects.filter(Q(sender=user) | Q(receiver=user)).order_by('timestamp')
        # Agrupa por contacto
        contacts = {}
        for m in messages:
            other = m.receiver if m.sender == user else m.sender
            if other.id not in contacts:
                contacts[other.id] = {
                    'contact': {
                        'id': str(other.id),
                        'name': other.username,
                        'avatar': f'https://i.pravatar.cc/150?img={(other.id % 70) + 1}',
                        'specialty': getattr(other, 'role', 'General'),
                        'online': True,
                    },
                    'lastMessage': m.content,
                    'unread': 0,
                    'updatedAt': m.timestamp.isoformat(),
                }
            # Actualiza último mensaje y unread
            contacts[other.id]['lastMessage'] = m.content
            contacts[other.id]['updatedAt'] = m.timestamp.isoformat()

        # Cuenta no leídos
        unread_qs = Message.objects.filter(receiver=user, is_read=False).values('sender').annotate(cnt=Count('id'))
        for entry in unread_qs:
            sid = entry['sender']
            if sid in contacts:
                contacts[sid]['unread'] = entry['cnt']

        # Si no hay conversaciones, devuelve mock de ejemplo para demo (2 contactos)
        if not contacts:
            return Response([
                {
                    'id': '1',
                    'contact': {'id': '1', 'name': 'Elena Mora', 'avatar': 'https://i.pravatar.cc/150?img=5', 'specialty': 'Retrato', 'online': True},
                    'lastMessage': '¿Podemos agendar la sesión para el jueves?',
                    'unread': 2,
                    'updatedAt': m.timestamp.isoformat() if messages else ''
                },
                {
                    'id': '2',
                    'contact': {'id': '2', 'name': 'Marc Dubois', 'avatar': 'https://i.pravatar.cc/150?img=15', 'specialty': 'Moda', 'online': False},
                    'lastMessage': 'Te envié la cotización actualizada.',
                    'unread': 1,
                    'updatedAt': m.timestamp.isoformat() if messages else ''
                },
            ])

        result = []
        for cid, data in contacts.items():
            result.append({
                'id': str(cid),
                'contact': data['contact'],
                'lastMessage': data['lastMessage'],
                'unread': data['unread'],
                'updatedAt': data['updatedAt'],
            })
        # Ordena por actualizado
        result.sort(key=lambda x: x['updatedAt'], reverse=True)
        return Response(result)


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

        msg = Message.objects.create(sender=request.user, receiver=receiver, content=content)
        serializer = MessageSerializer(msg)
        return Response({
            'id': msg.id,
            'senderId': 'me',
            'text': msg.content,
            'timestamp': msg.timestamp.isoformat(),
        }, status=status.HTTP_201_CREATED)
