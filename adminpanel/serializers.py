from django.contrib.auth import get_user_model
from rest_framework import serializers

from portfolio.models import PortfolioItem
from portfolio.serializers import PortfolioItemSerializer

User = get_user_model()


class AdminUserSerializer(serializers.ModelSerializer):
    works_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role',
                  'is_active', 'is_suspended', 'is_staff', 'is_superuser', 'date_joined', 'phone_number',
                  'works_count']
        read_only_fields = ['id', 'username', 'email', 'date_joined', 'works_count']

    def get_works_count(self, obj):
        return PortfolioItem.objects.filter(owner=obj).count()


class AdminWorkSerializer(PortfolioItemSerializer):
    owner_id = serializers.IntegerField(source='owner.id', read_only=True)
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta(PortfolioItemSerializer.Meta):
        fields = PortfolioItemSerializer.Meta.fields + ['owner_id', 'owner_username']
        read_only_fields = ['id', 'likes', 'views', 'created_at', 'owner_id', 'owner_username']
