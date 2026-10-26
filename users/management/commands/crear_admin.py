"""
Crea (o corrige) el usuario Administrador de LuxArs.

El administrador accede al panel /admin/ para gestionar clientes y fotógrafos
(activar, suspender, cambiar rol) y moderar el contenido publicado
(obras rechazadas por +18 dejan de mostrarse públicamente).

Credenciales por defecto desde el .env:

    ADMIN_USER=admin
    ADMIN_EMAIL=admin@luxars.com
    ADMIN_PASSWORD=secreto

También se pueden pasar por línea de comandos:

    python manage.py crear_admin --username admin --email a@b.com --password 12345678

Es idempotente: si el usuario ya existe se actualizan rol/permisos
y solo se cambia la contraseña si se indica explícitamente.
"""
import os
import secrets
import string

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

User = get_user_model()


class Command(BaseCommand):
    help = 'Crea o actualiza el usuario Administrador (superuser con rol admin) de LuxArs.'

    def add_arguments(self, parser):
        parser.add_argument('--username', default=os.getenv('ADMIN_USER', 'admin'),
                            help='Nombre de usuario del administrador (default: ADMIN_USER o "admin")')
        parser.add_argument('--email', default=os.getenv('ADMIN_EMAIL', 'admin@luxars.com'),
                            help='Correo del administrador (default: ADMIN_EMAIL)')
        parser.add_argument('--password', default=os.getenv('ADMIN_PASSWORD', ''),
                            help='Contraseña (default: ADMIN_PASSWORD del .env; si se omite se genera una)')
        parser.add_argument('--set-password', action='store_true',
                            help='Fuerza el cambio de contraseña aunque el usuario ya exista')

    def _generate_password(self, length=16):
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(length))

    def handle(self, *args, **options):
        username = options['username'].strip()
        email = options['email'].strip()
        password = options['password']
        set_password = options['set_password']

        if not username or not email:
            raise CommandError('Debe indicarse un username y un email válidos.')

        user = User.objects.filter(username=username).first()
        if user is None and email:
            user = User.objects.filter(email__iexact=email).first()

        generated = False
        password_changed = False

        if user is None:
            # Usuario nuevo: si no hay contraseña, se genera una y se muestra
            if not password:
                password = self._generate_password()
                generated = True
            user = User(username=username, email=email)
            user.set_password(password)
            created = True
        else:
            created = False
            if set_password:
                if not password:
                    password = self._generate_password()
                    generated = True
                user.set_password(password)
                password_changed = True

        # Garantiza los privilegios de administración
        user.email = email
        user.role = User.Role.ADMIN
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS(
                f'Administrador creado: {user.username} ({user.email})'
            ))
            self.stdout.write(f'Contraseña: {password}')
            if generated:
                self.stdout.write(self.style.WARNING(
                    'Contraseña generada: guárdala en ADMIN_PASSWORD del .env para poder regenerarla.'
                ))
        else:
            self.stdout.write(self.style.SUCCESS(
                f'Administrador actualizado: {user.username} ({user.email}) — rol admin, superuser activo.'
            ))
            if password_changed:
                self.stdout.write(f'Nueva contraseña: {password}' + (' (generada)' if generated else ''))

        self.stdout.write('Panel: /admin/ (gestión de usuarios, fotógrafos y moderación de obras)')
