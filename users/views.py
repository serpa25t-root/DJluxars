from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.throttling import AnonRateThrottle
from django.contrib.auth import authenticate, get_user_model
from django.db.models import Sum
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

from portfolio.models import PortfolioItem
from .serializers import RegisterSerializer, UserListSerializer, ProfileSerializer

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'role': user.role,
                        'phone_number': user.phone_number,
                        'departamento': getattr(user, 'departamento', ''),
                        'ciudad': getattr(user, 'ciudad', ''),
                    },
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        email = request.data.get('email')
        username = request.data.get('username') or email
        password = request.data.get('password')

        if not password or not username:
            return Response(
                {'detail': 'Credenciales incorrectas.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Intenta autenticar por username primero
        user = authenticate(request, username=username, password=password)

        # Fallback: buscar el correo (insensible a mayúsculas) y autenticar con su username
        if not user and username:
            try:
                found = User.objects.filter(email__iexact=username).first()
                if found:
                    user = authenticate(request, username=found.username, password=password)
            except User.DoesNotExist:
                pass

        if not user:
            return Response(
                {'detail': 'Credenciales incorrectas.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                    'phone_number': user.phone_number,
                    'departamento': getattr(user, 'departamento', ''),
                    'ciudad': getattr(user, 'ciudad', ''),
                },
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'token': str(refresh.access_token),
            },
            status=status.HTTP_200_OK,
        )


class MeView(APIView):
    """
    Perfil del usuario autenticado.
    GET  → perfil completo (con avatar, bio, ubicación)
    PATCH/PUT → actualización parcial, soporta multipart para subir avatar/cover
    """

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        serializer = ProfileSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request},
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        return self.patch(request, *args, **kwargs)


class PublicProfileView(APIView):
    """Perfil público de cualquier usuario + métricas estilo Instagram."""

    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'detail': 'Perfil no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        profile = ProfileSerializer(user, context={'request': request}).data

        aggregates = PortfolioItem.objects.filter(owner=user).aggregate(
            works=Sum('likes'), likes=Sum('likes'), views=Sum('views')
        )
        works_qs = PortfolioItem.objects.filter(owner=user)
        profile['stats'] = {
            'works': works_qs.count(),
            'likes': aggregates.get('likes') or 0,
            'views': aggregates.get('views') or 0,
        }
        profile['is_artist'] = getattr(user, 'is_artist', user.role == User.Role.ARTIST)
        return Response(profile)


class UserPortfolioView(APIView):
    """Obras públicas de un usuario (para ver el perfil de otros creadores)."""

    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        from portfolio.serializers import PortfolioItemSerializer

        items = PortfolioItem.objects.filter(owner_id=pk)
        serializer = PortfolioItemSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)


class UserListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        role = request.query_params.get('role')
        qs = User.objects.all()
        if role:
            qs = qs.filter(role=role)
        serializer = UserListSerializer(qs[:20], many=True)
        return Response({'results': serializer.data})


class LogoutView(APIView):
    """Blacklist all outstanding refresh tokens for the authenticated user."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            else:
                tokens = OutstandingToken.objects.filter(user=request.user)
                for token in tokens:
                    BlacklistedToken.objects.get_or_create(token=token)
        except Exception:
            pass
        return Response({'detail': 'Sesión cerrada correctamente.'}, status=status.HTTP_200_OK)
