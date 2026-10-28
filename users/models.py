from django.contrib.auth.models import AbstractUser
from django.db import models


class LuxUser(AbstractUser):
    """
    Modelo de usuario personalizado para LuxArts.
    Extiende AbstractUser para permitir futura personalización:
    - roles (cliente, artista, admin)
    - perfil extendido (bio, teléfono)
    Hereda: username, email, first_name, last_name, is_active, date_joined, etc.
    """

    class Role(models.TextChoices):
        CLIENT = 'client', 'Cliente'
        ARTIST = 'artist', 'Fotógrafo'
        ADMIN = 'admin', 'Administrador'
        BOTH = 'both', 'Cliente y Fotógrafo'

    # Email único y obligatorio para LuxArts
    email = models.EmailField(
        'correo electrónico',
        unique=True,
        help_text='Requerido. Debe ser único en la plataforma.'
    )

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CLIENT,
        verbose_name='rol',
        help_text='Rol del usuario dentro de la plataforma LuxArts'
    )

    # Suspensión "suave": el usuario puede iniciar sesión, pero su perfil y
    # portafolio público muestran "Cuenta suspendida".
    is_suspended = models.BooleanField(
        default=False,
        verbose_name='cuenta suspendida',
        help_text='Si está activo, el usuario puede iniciar sesión pero su perfil '
                  'público muestra "Cuenta suspendida" y no se lista.'
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True,
        verbose_name='teléfono'
    )

    departamento = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='departamento',
        help_text='Departamento de residencia para escalabilidad de búsqueda'
    )

    ciudad = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='ciudad',
        help_text='Ciudad de residencia para escalabilidad de búsqueda'
    )

    bio = models.TextField(
        blank=True,
        verbose_name='biografía',
        help_text='Descripción breve del usuario/artista'
    )

    # Perfil visual estilo Instagram (requiere Pillow + MEDIA config, ya configurados)
    avatar = models.ImageField(
        upload_to='avatars/',
        blank=True,
        null=True,
        verbose_name='foto de perfil'
    )

    cover = models.ImageField(
        upload_to='covers/',
        blank=True,
        null=True,
        verbose_name='imagen de portada',
        help_text='Banner superior del perfil personal'
    )

    website = models.URLField(
        blank=True,
        verbose_name='sitio web',
        help_text='Enlace externo (portafolio, redes, etc.)'
    )

    # Información comercial del fotógrafo (visible en su perfil público)
    specialty = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='especialidad',
        help_text='Ej: Retrato, Moda, Eventos (separadas por coma)'
    )

    price = models.PositiveIntegerField(
        default=0,
        verbose_name='tarifa base (COP)',
        help_text='Precio base por sesión, fijado por el fotógrafo'
    )

    class Meta:
        db_table = 'users_user'
        verbose_name = 'usuario'
        verbose_name_plural = 'usuarios'
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

    @property
    def is_artist(self):
        return self.role in (self.Role.ARTIST, self.Role.BOTH)

    @property
    def is_client(self):
        return self.role in (self.Role.CLIENT, self.Role.BOTH)
