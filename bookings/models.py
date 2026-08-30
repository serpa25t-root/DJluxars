from django.db import models
from django.conf import settings

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('accepted', 'Confirmada'),
        ('rejected', 'Rechazada'),
        ('completed', 'Finalizada'),
    ]

    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_bookings')
    photographer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='artist_bookings')
    date = models.DateField()
    service = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    message = models.TextField(blank=True)
    price = models.PositiveIntegerField(help_text='Valor total fijado por fotógrafo')
    platform_fee = models.PositiveIntegerField(default=0)
    artist_payout = models.PositiveIntegerField(default=0)
    base_price = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'reserva'
        verbose_name_plural = 'reservas'

    def __str__(self):
        return f"Reserva {self.id} {self.client} -> {self.photographer} ({self.status})"
