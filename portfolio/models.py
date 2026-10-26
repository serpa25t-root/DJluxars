from django.db import models
from django.conf import settings


class PortfolioItemQuerySet(models.QuerySet):
    def public(self):
        """Obras visibles para el público (excluye contenido rechazado por moderación)."""
        return self.exclude(status=PortfolioItem.Status.REJECTED)


class PortfolioItem(models.Model):
    CATEGORY_CHOICES = [
        ('Retrato', 'Retrato'),
        ('Editorial', 'Editorial'),
        ('Eventos', 'Eventos'),
        ('Moda', 'Moda'),
        ('Arquitectura', 'Arquitectura'),
    ]
    MEDIA_CHOICES = [
        ('imagen', 'Imagen'),
        ('video', 'Video'),         
    ]

    class Status(models.TextChoices):
        APPROVED = 'aprobado', 'Aprobado'
        PENDING = 'pendiente', 'Pendiente de revisión'
        REJECTED = 'rechazado', 'Rechazado (contenido no permitido)'

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='portfolio_items')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Retrato')
    media_type = models.CharField(max_length=20, choices=MEDIA_CHOICES, default='imagen')
    # Para imagen local
    image = models.ImageField(upload_to='portfolio/', blank=True, null=True)
    file = models.FileField(upload_to='portfolio/', blank=True, null=True)
    video_url = models.URLField(blank=True)
    equipment = models.CharField(max_length=200, blank=True)
    likes = models.PositiveIntegerField(default=0)
    views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    # Moderación de contenido (la obra permanece pública hasta que el admin la rechaza)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.APPROVED,
        verbose_name='estado de moderación',
        help_text='Las obras rechazadas (+18 o infracción) dejan de mostrarse públicamente'
    )
    moderation_reason = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='motivo de moderación',
        help_text='Motivo indicado por el administrador al rechazar la obra'
    )

    objects = PortfolioItemQuerySet.as_manager()

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'obra'
        verbose_name_plural = 'obras'

    def __str__(self):
        return f"{self.title} ({self.owner})"

    @property
    def is_public(self):
        return self.status != self.Status.REJECTED
