from django.contrib import admin

from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'recipient', 'type', 'is_read', 'created_at')
    list_filter = ('type', 'is_read', 'created_at')
    search_fields = ('title', 'body', 'recipient__username', 'recipient__email')
    readonly_fields = ('recipient', 'actor', 'type', 'title', 'body', 'link', 'created_at')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
