from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import LuxUser


@admin.register(LuxUser)
class LuxUserAdmin(BaseUserAdmin):
    """
    Admin para el LuxUser custom de LuxArts.
    Extiende UserAdmin para mostrar campo 'role' y mantener gestión de permisos.
    """
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Información LuxArts', {'fields': ('role', 'phone_number', 'departamento', 'ciudad', 'bio')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Información LuxArts', {'fields': ('role', 'phone_number')}),
    )
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    actions = ['activar_usuarios', 'suspender_usuarios', 'asignar_rol_artista',
               'asignar_rol_cliente', 'asignar_rol_admin', 'dar_acceso_panel']

    @admin.action(description='⛔ Suspender usuarios seleccionados (su perfil queda marcado como suspendido)')
    def suspender_usuarios(self, request, queryset):
        updated = queryset.filter(is_superuser=False).update(is_suspended=True)
        skipped = queryset.filter(is_superuser=True).count()
        msg = f'{updated} usuario(s) suspendido(s). Pueden iniciar sesión, pero su perfil público muestra "Cuenta suspendida".'
        if skipped:
            msg += f' {skipped} administrador(es) no se suspendió(ron).'
        self.message_user(request, msg)

    @admin.action(description='✅ Activar usuarios seleccionados')
    def activar_usuarios(self, request, queryset):
        updated = queryset.update(is_suspended=False)
        self.message_user(request, f'{updated} usuario(s) activado(s).')

    @admin.action(description='📷 Asignar rol Artista (fotógrafo)')
    def asignar_rol_artista(self, request, queryset):
        updated = queryset.update(role=User.Role.ARTIST)
        self.message_user(request, f'{updated} usuario(s) ahora son artistas.')

    @admin.action(description='👤 Asignar rol Cliente')
    def asignar_rol_cliente(self, request, queryset):
        updated = queryset.update(role=User.Role.CLIENT)
        self.message_user(request, f'{updated} usuario(s) ahora son clientes.')

    @admin.action(description='🔑 Asignar rol Administrador (y dar acceso al panel)')
    def asignar_rol_admin(self, request, queryset):
        updated = queryset.update(role=User.Role.ADMIN, is_staff=True)
        self.message_user(request, f'{updated} usuario(s) ahora son administradores.')

    @admin.action(description='🛠️ Dar acceso al panel /admin/ (is_staff)')
    def dar_acceso_panel(self, request, queryset):
        updated = queryset.update(is_staff=True)
        self.message_user(request, f'{updated} usuario(s) con acceso al panel.')
