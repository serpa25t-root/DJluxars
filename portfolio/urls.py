from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PortfolioViewSet

router = DefaultRouter()
router.register(r'', PortfolioViewSet, basename='portfolio')

urlpatterns = [
    path('', include(router.urls)),
]
