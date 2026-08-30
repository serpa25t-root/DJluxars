from django.db import models
from django.conf import settings

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

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'obra'
        verbose_name_plural = 'obras'

    def __str__(self):
        return f"{self.title} ({self.owner})"
