from rest_framework import permissions


class IsAdminRole(permissions.BasePermission):
    """Solo usuarios con rol admin / staff / superuser."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return bool(user.is_staff or user.is_superuser or getattr(user, 'role', None) == 'admin')
