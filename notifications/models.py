from django.conf import settings
from django.db import models
from django.utils import timezone


class Notification(models.Model):
    """
    Notificación in-app para cliente y fotógrafo.

    Se crea automáticamente cuando ocurre algo relevante: un mensaje nuevo
    en el chat, una reserva creada/aceptada/rechazada, o la moderación de una
    obra. El frontend las muestra con fecha y hora (estilo WhatsApp).
    """

    class Type(models.TextChoices):
        MESSAGE = 'mensaje', 'Mensaje'
        BOOKING = 'reserva', 'Reserva'
        CONTENT = 'contenido', 'Contenido'
        SYSTEM = 'sistema', 'Sistema'

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name='destinatario',
    )
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications_triggered',
        verbose_name='remitente',
        help_text='Usuario que origina la notificación (si aplica)',
    )
    type = models.CharField(
        max_length=20,
        choices=Type.choices,
        default=Type.SYSTEM,
        verbose_name='tipo',
    )
    title = models.CharField(max_length=150, verbose_name='título')
    body = models.TextField(blank=True, verbose_name='mensaje')
    link = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='enlace',
        help_text='Ruta del frontend a la que lleva la notificación',
    )
    is_read = models.BooleanField(default=False, verbose_name='leída')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='fecha')

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'notificación'
        verbose_name_plural = 'notificaciones'
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f'{self.title} → {self.recipient}'

    @property
    def created_local(self):
        """Fecha/hora en la zona del servidor (lo usa el admin de Django)."""
        return timezone.localtime(self.created_at)
