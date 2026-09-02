from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class LuxTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Permite iniciar sesión con email o username (el registro de LuxArts solo pide email).
    Búsqueda de email insensible a mayúsculas/minúsculas.
    """

    def validate(self, attrs):
        password = attrs.get('password')
        username = attrs.get(self.username_field)
        request = self.context.get('request')

        user = authenticate(request=request, username=username, password=password)
        if user is None and username:
            try:
                found = User.objects.get(email__iexact=username)
            except User.DoesNotExist:
                raise AuthenticationFailed('Credenciales incorrectas.')
            user = authenticate(request=request, username=found.username, password=password)

        if user is None or not user.is_active:
            raise AuthenticationFailed('Credenciales incorrectas.')

        refresh = RefreshToken.for_user(user)
        return {'refresh': str(refresh), 'access': str(refresh.access_token)}


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=10)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    departamento = serializers.CharField(required=False, allow_blank=True)
    ciudad = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'phone_number', 'first_name', 'last_name', 'departamento', 'ciudad']
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('El correo ya está registrado.')
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('El nombre de usuario ya está en uso.')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserListSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()
    category = serializers.CharField(source='role', read_only=True)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'name', 'role', 'category', 'profile_picture', 'avatar', 'departamento', 'ciudad']

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full or obj.username

    def get_profile_picture(self, obj):
        # Placeholder avatar
        return f"https://i.pravatar.cc/150?img={(obj.id % 70) + 1}"

    def get_avatar(self, obj):
        return f"https://i.pravatar.cc/150?img={(obj.id % 70) + 1}"


class ProfileSerializer(serializers.ModelSerializer):
    """
    Perfil personal editable (estilo Instagram).
    Soporta actualización parcial vía multipart (avatar / cover).
    """

    name = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    cover_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'role', 'first_name', 'last_name', 'name',
            'phone_number', 'bio', 'departamento', 'ciudad', 'website',
            'avatar', 'cover', 'avatar_url', 'cover_url', 'date_joined',
        ]
        read_only_fields = ['id', 'email', 'role', 'date_joined']
        extra_kwargs = {
            'avatar': {'required': False, 'allow_null': True},
            'cover': {'required': False, 'allow_null': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'phone_number': {'required': False, 'allow_blank': True},
            'bio': {'required': False, 'allow_blank': True},
            'website': {'required': False, 'allow_blank': True},
            'departamento': {'required': False, 'allow_blank': True},
            'ciudad': {'required': False, 'allow_blank': True},
        }

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full or obj.username

    def _absolute(self, obj, field_name, fallback_seed=0):
        image = getattr(obj, field_name, None)
        if image:
            request = self.context.get('request')
            try:
                return request.build_absolute_uri(image.url) if request else image.url
            except Exception:
                return image.url
        return f"https://i.pravatar.cc/150?img={(obj.id % 70) + 1}"

    def get_avatar_url(self, obj):
        return self._absolute(obj, 'avatar')

    def get_cover_url(self, obj):
        # Sin portada no devolvemos placeholder: el frontend usa su degradado propio
        image = getattr(obj, 'cover', None)
        if not image:
            return ''
        request = self.context.get('request')
        try:
            return request.build_absolute_uri(image.url) if request else image.url
        except Exception:
            return image.url

    def validate_username(self, value):
        qs = User.objects.filter(username=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('El nombre de usuario ya está en uso.')
        return value
