from django.urls import path
from .views import RegisterView, LoginView, MeView, UserListView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='users-register'),
    path('login/', LoginView.as_view(), name='users-login'),
    path('me/', MeView.as_view(), name='users-me'),
    path('', UserListView.as_view(), name='users-list'),
]
