from rest_framework import serializers
from .models import PortfolioItem

ALLOWED_MIME_TYPES = {'image/jpeg', 'image/png', 'image/webp', 'image/gif'}
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB

class PortfolioItemSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioItem
        fields = ['id', 'title', 'description', 'category', 'media_type', 'image', 'file', 'video_url', 'equipment', 'likes', 'views', 'created_at', 'file_url', 'image_url']
        read_only_fields = ['id', 'likes', 'views', 'created_at']
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True},
            'file': {'required': False, 'allow_null': True},
            'video_url': {'required': False, 'allow_blank': True},
        }

    def get_file_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            try:
                return request.build_absolute_uri(obj.image.url) if request else obj.image.url
            except Exception:
                return obj.image.url
        if obj.file:
            request = self.context.get('request')
            try:
                return request.build_absolute_uri(obj.file.url) if request else obj.file.url
            except Exception:
                return obj.file.url
        return obj.video_url or ''

    def get_image_url(self, obj):
        return self.get_file_url(obj)

    def validate_image(self, value):
        if value and hasattr(value, 'content_type'):
            if value.content_type not in ALLOWED_MIME_TYPES:
                raise serializers.ValidationError(f'Tipo de archivo no permitido: {value.content_type}. Formatos aceptados: JPEG, PNG, WebP, GIF.')
            if value.size > MAX_UPLOAD_SIZE:
                raise serializers.ValidationError('El archivo excede el límite de 10 MB.')
        return value

    def validate_video_url(self, value):
        if value and value.strip():
            from urllib.parse import urlparse
            parsed = urlparse(value)
            if parsed.scheme not in ('http', 'https'):
                raise serializers.ValidationError('La URL del video debe usar http o https.')
        return value

    def validate(self, attrs):
        media_type = attrs.get('media_type') or (self.instance.media_type if self.instance else 'imagen')
        return attrs
