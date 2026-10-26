import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone


class Payment(models.Model):
    """
    Pasarela de pago FICTICIA de LuxArts.

    Simula el cobro al cliente y el desglose de comisión (10% plataforma,
    90% al fotógrafo). No hay integración real con un proveedor: el pago se
    marca como aprobado en el acto para fines de demostración.
    """

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pendiente'
        SUCCESS = 'success', 'Aprobado'
        FAILED = 'failed', 'Fallido'
        REFUNDED = 'refunded', 'Reembolsado'

    class Method(models.TextChoices):
        CARD = 'tarjeta', 'Tarjeta'
        PSE = 'pse', 'PSE'
        NEQUI = 'nequi', 'Nequi'

    booking = models.OneToOneField(
        'bookings.Booking',
        on_delete=models.CASCADE,
        related_name='payment',
        verbose_name='reserva',
    )
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payments',
        verbose_name='cliente',
    )
    amount = models.PositiveIntegerField(verbose_name='monto total')
    platform_fee = models.PositiveIntegerField(default=0, verbose_name='comisión plataforma')
    artist_payout = models.PositiveIntegerField(default=0, verbose_name='pago al fotógrafo')
    method = models.CharField(
        max_length=20,
        choices=Method.choices,
        default=Method.CARD,
        verbose_name='método',
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        verbose_name='estado',
    )
    transaction_id = models.CharField(
        max_length=64,
        unique=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name='transacción',
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='creado')
    paid_at = models.DateTimeField(null=True, blank=True, verbose_name='pagado')

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'pago'
        verbose_name_plural = 'pagos'

    def __str__(self):
        return f'Pago {self.transaction_id[:8]} — {self.booking_id} ({self.status})'

    def mark_success(self):
        self.status = self.Status.SUCCESS
        self.paid_at = timezone.now()
        self.save(update_fields=['status', 'paid_at'])
