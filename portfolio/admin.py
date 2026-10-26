from django.contrib import admin

from .models import PortfolioItem


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    """
    Moderación de obras publicadas por los fotógrafos.

    Las obras quedan públicas hasta que el administrador las rechaza
    (contenido +18 o infracción), momento en que dejan de mostrarse
    en los perfiles y estadísticas públicas.
    """
    list_display = ('title', 'owner', 'category', 'media_type', 'status',
                    'likes', 'views', 'created_at')
    list_filter = ('status', 'category', 'media_type', 'created_at')
    search_fields = ('title', 'description', 'owner__username', 'owner__email')
    autocomplete_fields = ('owner',)
    readonly_fields = ('likes', 'views', 'created_at')
    date_hierarchy = 'created_at'
    list_editable = ('status',)
    empty_value_display = '—'
    actions = ['aprobar_obras', 'rechazar_por_contenido_adulto', 'marcar_pendiente']

    fieldsets = (
        ('Obra', {'fields': ('owner', 'title', 'description', 'category', 'media_type')}),
        ('Archivos', {'fields': ('image', 'file', 'video_url', 'equipment')}),
        ('Moderación', {'fields': ('status', 'moderation_reason')}),
        ('Métricas', {'fields': ('likes', 'views', 'created_at')}),
    )

    @admin.action(description='✅ Aprobar obras seleccionadas (vuelven a ser públicas)')
    def aprobar_obras(self, request, queryset):
        items = list(queryset)
        updated = queryset.update(status=PortfolioItem.Status.APPROVED, moderation_reason='')
        self._notificar_artistas(items, approved=True)
        self.message_user(request, f'{updated} obra(s) aprobada(s) y visibles públicamente.')

    @admin.action(description='🔞 Rechazar por contenido +18 / no permitido (dejan de mostrarse)')
    def rechazar_por_contenido_adulto(self, request, queryset):
        motivo = 'Contenido +18 o que infringe las normas de la plataforma.'
        items = list(queryset)
        updated = queryset.update(status=PortfolioItem.Status.REJECTED, moderation_reason=motivo)
        for item in items:
            item.moderation_reason = motivo
        self._notificar_artistas(items, approved=False)
        self.message_user(
            request,
            f'{updated} obra(s) rechazada(s): ya no aparecen en perfiles públicos ni en estadísticas.'
        )

    @admin.action(description='🕒 Marcar como pendiente de revisión')
    def marcar_pendiente(self, request, queryset):
        updated = queryset.update(status=PortfolioItem.Status.PENDING)
        self.message_user(request, f'{updated} obra(s) marcada(s) como pendientes.')

    def _notificar_artistas(self, items, approved):
        """Avisa por notificación in-app al dueño de cada obra moderada."""
        from notifications.services import notify_content_status
        for item in items:
            notify_content_status(item, approved=approved)
