from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, UserListSerializer

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

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
                    },
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

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

        # Fallback: buscar por email y autenticar con username real
        if not user and email:
            try:
                found = User.objects.get(email=email)
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
                },
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'token': str(refresh.access_token),
            },
            status=status.HTTP_200_OK,
        )


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'phone_number': getattr(user, 'phone_number', ''),
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        )


class UserListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        role = request.query_params.get('role')
        qs = User.objects.all()
        if role:
            qs = qs.filter(role=role)
        serializer = UserListSerializer(qs[:20], many=True)
        # Soporta paginación simple results
        return Response({'results': serializer.data})
