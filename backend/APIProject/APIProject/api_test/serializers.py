from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from .models import FileModel
from django.contrib.auth.models import User

class CustomUserCreateSerializer(UserCreateSerializer):

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = "__all__"
        # fields = ('id', 'username', 'email', 'password', 'first_name', 'is_superuser')


class FileModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileModel
        fields = "__all__"
        # fields = ['file', 'user']


# class DataUserSerializer(serializers.ModelSerializer):
#     # user = serializers.HiddenField(default=serializers.CurrentUserDefault())
#
#     class Meta:
#         model = DataUser
#         fields = "__all__"
#         fields = ('name', 'fullname', 'email', 'password')