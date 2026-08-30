from rest_framework import serializers
from .models import PortfolioItem

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
            except:
                return obj.image.url
        if obj.file:
            request = self.context.get('request')
            try:
                return request.build_absolute_uri(obj.file.url) if request else obj.file.url
            except:
                return obj.file.url
        return obj.video_url or ''

    def get_image_url(self, obj):
        return self.get_file_url(obj)

    def validate(self, attrs):
        media_type = attrs.get('media_type') or self.instance.media_type if self.instance else 'imagen'
        # En creación, si es imagen debe traer file/image, si video debe traer video_url
        # Permitimos ambos para demo
        return attrs
