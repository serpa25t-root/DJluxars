from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.throttling import AnonRateThrottle
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Sum
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

from portfolio.models import PortfolioItem
from .serializers import RegisterSerializer, UserListSerializer, ProfileSerializer

LuxUser = get_user_model()


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
                found = LuxUser.objects.filter(email__iexact=username).first()
                if found:
                    user = authenticate(request, username=found.username, password=password)
            except LuxUser.DoesNotExist:
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


class BecomeArtistView(APIView):
    """
    Activa el rol de fotógrafo en la cuenta actual SIN cerrar la sesión
    (patrón MercadoLibre: una cuenta, múltiples capacidades).

    - client -> both (conserva capacidades de cliente para poder reservar)
    - artist/both -> idempotente
    - admin  -> 403 (perdería su rol de administración)
    """

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        user = request.user

        if getattr(user, 'is_suspended', False):
            return Response(
                {'detail': 'Tu cuenta está suspendida y no puede activar el rol de fotógrafo.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        if user.role == LuxUser.Role.ADMIN:
            return Response(
                {'detail': 'Las cuentas de administrador no pueden convertirse en fotógrafos.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        specialty = str(request.data.get('specialty') or '').strip()
        ciudad = str(request.data.get('ciudad') or '').strip()

        raw_price = request.data.get('price')
        try:
            price = int(str(raw_price).replace('.', '').replace(',', ''))
        except (TypeError, ValueError):
            price = None

        errors = {}
        if not specialty:
            errors['specialty'] = ['Indica tu especialidad (ej: Retrato, Moda, Eventos).']
        elif len(specialty) > 100:
            errors['specialty'] = ['Máximo 100 caracteres.']
        if price is None or price <= 0:
            errors['price'] = ['Establece una tarifa base mayor a 0 (COP por sesión).']
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        user.specialty = specialty
        user.price = price
        if ciudad:
            user.ciudad = ciudad
        if user.role == LuxUser.Role.CLIENT:
            user.role = LuxUser.Role.BOTH
        user.save()

        return Response(
            ProfileSerializer(user, context={'request': request}).data,
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
            user = LuxUser.objects.get(pk=pk)
        except LuxUser.DoesNotExist:
            return Response({'detail': 'Perfil no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        profile = ProfileSerializer(user, context={'request': request}).data

        # Cuenta suspendida: no se exponen métricas ni obras públicas
        if getattr(user, 'is_suspended', False):
            profile['stats'] = {'works': 0, 'likes': 0, 'views': 0}
            profile['is_suspended'] = True
            return Response(profile)

        aggregates = PortfolioItem.objects.public().filter(owner=user).aggregate(
            works=Sum('likes'), likes=Sum('likes'), views=Sum('views')
        )
        works_qs = PortfolioItem.objects.public().filter(owner=user)
        profile['stats'] = {
            'works': works_qs.count(),
            'likes': aggregates.get('likes') or 0,
            'views': aggregates.get('views') or 0,
        }
        profile['is_artist'] = getattr(user, 'is_artist', user.role == LuxUser.Role.ARTIST)
        return Response(profile)


class UserPortfolioView(APIView):
    """Obras públicas de un usuario (para ver el perfil de otros creadores)."""

    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        from portfolio.serializers import PortfolioItemSerializer
        try:
            user = LuxUser.objects.get(pk=pk)
        except LuxUser.DoesNotExist:
            return Response({'detail': 'Perfil no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        if getattr(user, 'is_suspended', False):
            return Response([])
        items = PortfolioItem.objects.public().filter(owner_id=pk)
        serializer = PortfolioItemSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)


class UserListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        role = request.query_params.get('role')
        qs = LuxUser.objects.all()
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
