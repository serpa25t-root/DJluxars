from django.urls import path

from .views import MarkReadView, NotificationsView, UnreadCountView

urlpatterns = [
    path('', NotificationsView.as_view(), name='notifications-list'),
    path('unread-count/', UnreadCountView.as_view(), name='notifications-unread-count'),
    path('read/', MarkReadView.as_view(), name='notifications-read'),
]
