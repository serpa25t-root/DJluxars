"""
Utilidad para crear notificaciones sin romper el flujo principal.

Nunca lanza excepciones: si falla el guardado de la notificación, la
acción del usuario (mensaje, reserva, moderación) igual se completa.
"""
import logging

from .models import Notification

logger = logging.getLogger(__name__)


def notify(recipient, title, body='', notif_type=Notification.Type.SYSTEM,
           actor=None, link=''):
    """Crea una notificación para `recipient` y la devuelve (o None)."""
    if recipient is None:
        return None
    try:
        return Notification.objects.create(
            recipient=recipient,
            actor=actor,
            type=notif_type,
            title=title,
            body=body or '',
            link=link or '',
        )
    except Exception:  # pragma: no cover - nunca debe romper la acción
        logger.exception('No se pudo crear la notificación para %s', recipient)
        return None


def notify_new_message(message):
    """Notifica al receptor de un mensaje del chat."""
    return notify(
        recipient=message.receiver,
        actor=message.sender,
        title=f'Mensaje de {message.sender.get_full_name() or message.sender.username}',
        body=(message.content or '')[:140],
        notif_type=Notification.Type.MESSAGE,
        link=f'/dashboard/mensajes?contactId={message.sender.id}',
    )


def notify_booking_created(booking):
    """Notifica al fotógrafo que llegó una reserva."""
    return notify(
        recipient=booking.photographer,
        actor=booking.client,
        title=f'Nueva reserva de {booking.client.get_full_name() or booking.client.username}',
        body=_booking_body(booking),
        notif_type=Notification.Type.BOOKING,
        link='/dashboard/bookings',
    )


def notify_booking_status(booking):
    """Notifica al cliente cuando el fotógrafo acepta o rechaza."""
    labels = {'accepted': 'aceptado', 'rejected': 'rechazado', 'completed': 'completado'}
    estado = labels.get(booking.status, booking.status)
    return notify(
        recipient=booking.client,
        actor=booking.photographer,
        title=f'Reserva {estado}',
        body=f'{booking.photographer.get_full_name() or booking.photographer.username} '
             f'{estado} tu solicitud. {_booking_body(booking)}',
        notif_type=Notification.Type.BOOKING,
        link='/my-bookings',
    )


def notify_content_status(item, approved):
    """Notifica al artista el resultado de la moderación de su obra."""
    if approved:
        title, body, link = (
            'Obra aprobada',
            f'«{item.title}» ya es visible en tu perfil público.',
            '/dashboard/portfolio',
        )
    else:
        title, body, link = (
            'Obra rechazada',
            f'«{item.title}» fue retirada del espacio público. '
            f'Motivo: {item.moderation_reason or "contenido no permitido"}.',
            '/dashboard/portfolio',
        )
    return notify(
        recipient=item.owner,
        title=title,
        body=body,
        notif_type=Notification.Type.CONTENT,
        link=link,
    )


def _booking_body(booking):
    parts = []
    service = getattr(booking, 'service', None)
    if service:
        parts.append(str(service))
    date = getattr(booking, 'date', None)
    if date:
        parts.append(f'Fecha: {date.strftime("%d/%m/%Y")}')
    location = getattr(booking, 'location', None)
    if location:
        parts.append(str(location))
    return ' • '.join(parts)
