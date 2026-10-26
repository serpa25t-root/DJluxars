from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    AdminUserViewSet, AdminWorkViewSet, AdminBookingViewSet,
    AdminPaymentViewSet, AdminStatsAPIView,
)

router = DefaultRouter()
router.register(r'users', AdminUserViewSet, basename='admin-users')
router.register(r'works', AdminWorkViewSet, basename='admin-works')
router.register(r'bookings', AdminBookingViewSet, basename='admin-bookings')
router.register(r'payments', AdminPaymentViewSet, basename='admin-payments')

urlpatterns = [
    path('stats/', AdminStatsAPIView.as_view(), name='admin-stats'),
    path('', include(router.urls)),
]
