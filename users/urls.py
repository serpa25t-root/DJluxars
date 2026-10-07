from django.urls import path
from .views import RegisterView, LoginView, LogoutView, MeView, UserListView, PublicProfileView, UserPortfolioView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='users-register'),
    path('login/', LoginView.as_view(), name='users-login'),
    path('logout/', LogoutView.as_view(), name='users-logout'),
    path('me/', MeView.as_view(), name='users-me'),
    path('<int:pk>/profile/', PublicProfileView.as_view(), name='users-profile'),
    path('<int:pk>/portfolio/', UserPortfolioView.as_view(), name='users-portfolio'),
    path('', UserListView.as_view(), name='users-list'),
]
