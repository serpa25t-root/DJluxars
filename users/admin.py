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
        ('Información LuxArts', {'fields': ('role', 'phone_number', 'bio')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Información LuxArts', {'fields': ('role', 'phone_number', 'bio')}),
    )
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
