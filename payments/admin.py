from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'booking', 'client', 'amount', 'status', 'method', 'created_at')
    list_filter = ('status', 'method', 'created_at')
    search_fields = ('transaction_id', 'client__username', 'booking__id')
    readonly_fields = ('transaction_id', 'created_at', 'paid_at')
    date_hierarchy = 'created_at'
