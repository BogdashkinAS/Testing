import os
import logging
import mimetypes

from django.views import View
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics, viewsets
from django.shortcuts import render
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser, IsAuthenticated
from rest_framework import permissions
from .models import FileModel
from .permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly, IsOwnerOrAdmin
from .serializers import CustomUserCreateSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

from django.conf import settings
from django.http import HttpResponse, Http404
from django.core.files.storage import FileSystemStorage

from django.shortcuts import get_object_or_404, redirect

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import FileModel
from .serializers import CustomUserCreateSerializer

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import FileModel
from .serializers import CustomUserCreateSerializer

from django.conf import settings

from django.core.files.storage import DefaultStorage
from rest_framework import viewsets, permissions, status
from .models import FileModel


from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import FileModel, User
from .serializers import FileModelSerializer
import os
from django.conf import settings

from django.contrib.auth.decorators import permission_required

from django.contrib.auth.models import User
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

from .models import FileModel
from .serializers import FileModelSerializer

from django.core.files.storage import default_storage
import os

from django.core.files.storage import FileSystemStorage
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.http import Http404
from django.conf import settings
import os

from .models import FileModel
from .serializers import FileModelSerializer

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.http import Http404
from .models import FileModel
from .serializers import FileModelSerializer
import os
from django.conf import settings
from pathlib import Path
import shutil

from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CustomUserCreateSerializer
from .models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


import os
from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import generics
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.permissions import IsAdminUser
from rest_framework.authentication import TokenAuthentication
from .models import FileModel
from .serializers import FileModelSerializer

# Create your views here.

logger = logging.getLogger('main')


# получение id пользователя по его token
class GetUserIdByToken(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        logger.debug("Model GetUserIdByToken started")
        user_id = request.user.id if request.user.id else None

        if user_id:
            logger.info("User id received successfully")
            return Response({'user_id': user_id}, status=200)
        else:
            logger.warning("User not found")
            return Response({'error': 'User not found'}, status=404)


# изменение значения "администратор"
class UserUpdateSuperuserView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, user_id, format=None):
        logger.debug("Model UserUpdateSuperuserView started")
        try:
            user = User.objects.get(id=user_id)
            new_is_superuser = not user.is_superuser  # Инвертируем текущее значение
            user.is_superuser = new_is_superuser
            user.save()
            new_is_staff = not user.is_staff  # Инвертируем текущее значение
            user.is_staff = new_is_staff
            user.save()
            serializer = CustomUserCreateSerializer(user)
            logger.info("user admin toggle successfully")
            return Response(serializer.data)
        except User.DoesNotExist:
            logger.error("User not found")
            return Response(status=404, data={'error': 'User not found'})


# получение данных пользователя по его id
class GetUserById(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, user_id):
        logger.debug("Model GetUserById started")
        try:
            user = User.objects.get(id=user_id)
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_superuser': user.is_superuser,
                # Добавьте другие необходимые поля пользователя
            }
            logger.info("user info received successfully")
            return Response(user_data)
        except User.DoesNotExist:
            logger.warning("User not found")
            return Response({'error': 'User not found'}, status=404)


# получение token пользователя по его id
class GetUserTokenView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        logger.debug("Model GetUserTokenView started")
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            token = Token.objects.get(user=user)
            user_token = token.key
            logger.info("user token received successfully")
            return Response({'token': user_token})
        except User.DoesNotExist:
            logger.warning("User not found")
            return Response(status=404, data={'error': 'User not found'})
        except Token.DoesNotExist:
            logger.warning("Token not found for the user")
            return Response(status=404, data={'error': 'Token not found for the user'})


# delete user (только для администратора!!!)
class DeleteUser(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, user_id, format=None):
        logger.debug("Model DeleteUser started")
        try:
            user_to_delete = User.objects.get(id=user_id)
        except User.DoesNotExist:
            logger.warning("User not found")
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user_folder_path = os.path.join(settings.MEDIA_ROOT, str(user_id))

        if os.path.exists(user_folder_path):
            shutil.rmtree(user_folder_path)  # Удаление папки пользователя с его файлами

        user_to_delete.delete()
        logger.info("User and associated files deleted successfully")
        return Response({'message': 'User and associated files deleted successfully'}, status=status.HTTP_200_OK)



# модель управления файлами пользователя
class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated,]
    authentication_classes = (TokenAuthentication, )
    logger.debug("Model FileUploadView started")

    # получение файлов пользователя
    def get(self, request, format=None):
        logger.debug("Model FileUploadView started")
        if 'user_id' in request.query_params:
            user_id = request.query_params['user_id']
            try:
                user_files = FileModel.objects.filter(user_id=user_id)
            except FileModel.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            serializer = FileModelSerializer(user_files, many=True)
            logger.info('User files received successfully')
            return Response(serializer.data)
        else:
            user_files = FileModel.objects.filter(user=request.user)
            serializer = FileModelSerializer(user_files, many=True)
            logger.info('User files received successfully')
            return Response(serializer.data)

    # загрузка файла пользователем с токеном
    def post(self, request, *args, **kwargs):
        file_serializer = FileModelSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save(user=request.user)
            logger.info('User file upload successfully')
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            logger.error('BAD_REQUEST')
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # update файла пользователя
    def patch(self, request, file_id, *args, **kwargs):
        try:
            file_model = FileModel.objects.get(id=file_id, user=request.user)
        except FileModel.DoesNotExist:
            logger.warning('File not found')
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)

        file_obj = self.get_object(file_id)

        mutable_request_data = request.data.copy()

        new_name = mutable_request_data.get('name')
        if new_name:
            original_file_path = file_obj.file.path
            original_file_name = file_obj.file.name
            _, file_extension = os.path.splitext(original_file_path)

            new_name_with_extension = f"{new_name}{file_extension}"
            mutable_request_data['name'] = new_name_with_extension

        serializer = FileModelSerializer(file_obj, data=mutable_request_data, partial=True)
        if serializer.is_valid():
            serializer.save()

            if new_name:
                new_relative_file_path = os.path.join(os.path.dirname(original_file_name), new_name_with_extension)
                new_absolute_path = os.path.join(settings.MEDIA_ROOT, new_relative_file_path)
                os.rename(original_file_path, new_absolute_path)

                file_obj.file.name = new_relative_file_path
                file_obj.save()

            logger.info('File update successfully')
            return Response(serializer.data)
        else:
            logger.error('BAD_REQUEST')
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_object(self, file_id):
        try:
            return FileModel.objects.get(pk=file_id)
        except FileModel.DoesNotExist:
            logger.error('Http404')
            raise Http404

    # delete файла пользователя
    def delete(self, request, file_id, format=None):
        try:
            file_model = FileModel.objects.get(id=file_id, user=request.user)
        except ObjectDoesNotExist:
            logger.warning('File not found')
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)

        file_path = file_model.file.path
        if os.path.isfile(file_path):
            os.remove(file_path)

            # Удаляем пустые папки пользователя
            user_folder_path = os.path.dirname(file_path)
            if not os.listdir(user_folder_path):
                os.rmdir(user_folder_path)

            file_model.delete()
            logger.info('File and record deleted successfully')
            return Response({'message': 'File and record deleted successfully'}, status=status.HTTP_200_OK)
        else:
            logger.warning('File not found')
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)


# получение всех файлов юзера по id
class FileModelView(APIView):
    permission_classes = (IsAuthenticated,)
    # authentication_classes = (TokenAuthentication,)

    def get(self, request, user_id, format=None):
        logger.debug("Model FileModelView started")
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            logger.warning("User not found")
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Проверяем, является ли текущий пользователь владельцем файлов или администратором
        if request.user.is_authenticated and (request.user.id == user_id or request.user.is_staff):
            files = FileModel.objects.filter(user=user)
            serializer = FileModelSerializer(files, many=True)
            logger.info("User is authenticated or staff, files received successfully")
            return Response(serializer.data)
        else:
            logger.warning("Access denied")
            return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)


# список всех юзеров
class UserListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        logger.debug("Model UserListView started")
        users = User.objects.all()
        serializer = CustomUserCreateSerializer(users, many=True)
        logger.info("Users received successfully")
        return Response(serializer.data)


# генерация ссылки по id файла
# class FileDownloadLinkView(APIView):
#     permission_classes = (IsAuthenticatedOrReadOnly,)
#     # authentication_classes = (TokenAuthentication,)
#
#     def download_link_file(request, file_id):
#         logger.debug("Model FileDownloadLinkView started")
#         # Получаем объект файла
#         file_object = get_object_or_404(FileModel, pk=file_id)
#         # Получаем абсолютный путь к файлу
#         file_path = file_object.file.path
#         # Определяем MIME-тип файла
#         mime_type, _ = mimetypes.guess_type(file_path)
#         mime_type = mime_type or 'application/octet-stream'  # Запасной вариант MIME-типа
#
#         # Проверяем существует ли файл
#         if os.path.exists(file_path):
#             with open(file_path, 'rb') as f:
#                 response = HttpResponse(f.read(), content_type=mime_type)
#
#                 response['Content-Disposition'] = 'attachment; filename="{}"'.format(os.path.basename(file_path))
#                 logger.info("Path for download received successfully")
#                 return response
#         else:
#             # Если файл не найден, возвращаем ошибку 404
#             logger.warning("File not found")
#             raise Http404("File not found")
class FileDownloadLinkView(View):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    # authentication_classes = (TokenAuthentication,)

    def download_link_file(request, file_id):
        logger.debug("Model FileDownloadLinkView started")
        # Получаем объект файла
        file_object = get_object_or_404(FileModel, pk=file_id)
        # Получаем абсолютный путь к файлу
        file_path = file_object.file.path

        # Проверяем существует ли файл
        if os.path.exists(file_path):
            with open(file_path, 'rb') as f:
                response = HttpResponse(f.read(), content_type='application/octet-stream')

                response['Content-Disposition'] = 'attachment; filename="{}"'.format(os.path.basename(file_path))
                logger.info("Path for download received successfully")
                return response
        else:
            # Если файл не найден, возвращаем ошибку 404
            logger.warning("File not found")
            raise Http404("File not found")

# update файла пользователя админом по id файла
class FileModelAPIUpdate(generics.RetrieveUpdateAPIView):
    queryset = FileModel.objects.all()
    serializer_class = FileModelSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def patch(self, request, file_id, *args, **kwargs):
        logger.debug("Model FileModelAPIUpdate started")
        try:
            file_obj = self.get_object(file_id)
            # Check if the request user is the owner of the file or is staff (admin)
            if file_obj.user != request.user and not request.user.is_staff:
                logger.warning("You do not have permission to update this file")
                return Response({"error": "You do not have permission to update this file"}, status=status.HTTP_403_FORBIDDEN)
        except FileModel.DoesNotExist:
            logger.warning("File not found")
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)

        mutable_request_data = request.data.copy()

        new_name = mutable_request_data.get('name')
        if new_name:
            original_file_path = file_obj.file.path
            _, file_extension = os.path.splitext(original_file_path)

            new_name_with_extension = f"{new_name}{file_extension}"
            mutable_request_data['name'] = new_name_with_extension

            new_relative_file_path = os.path.join(os.path.dirname(file_obj.file.name), new_name_with_extension)
            new_absolute_path = os.path.join(settings.MEDIA_ROOT, new_relative_file_path)

            try:
                os.rename(original_file_path, new_absolute_path)
                file_obj.file.name = new_relative_file_path
            except Exception as e:
                logger.error('Failed to update file on the server')
                return Response({"error": "Failed to update file on the server"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = FileModelSerializer(file_obj, data=mutable_request_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info('File update successfully')
            return Response(serializer.data)
        else:
            logger.error('BAD_REQUEST')
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_object(self, file_id):
        try:
            logger.info('File received successfully')
            return FileModel.objects.get(pk=file_id)
        except FileModel.DoesNotExist:
            logger.error('File not found')
            raise Http404


# delete файла пользователя админом по id файла
class FileModelAPIDestroy(generics.DestroyAPIView):
    queryset = FileModel.objects.all()
    serializer_class = FileModelSerializer
    permission_classes = (IsAdminUser,)
    authentication_classes = (TokenAuthentication,)

    def perform_destroy(self, instance):
        file_path = instance.file.path
        if os.path.isfile(file_path):
            os.remove(file_path)

            user_folder_path = os.path.dirname(file_path)
            if not os.listdir(user_folder_path):
                os.rmdir(user_folder_path)

        instance.delete()

    def destroy(self, request, *args, **kwargs):
        logger.debug("Model FileModelAPIDestroy started")
        instance = self.get_object()
        self.perform_destroy(instance)
        logger.info('File and record deleted successfully')
        return Response({"message": "File and record deleted successfully"}, status=status.HTTP_200_OK)

def index(request, *args, **kwargs):
    logger.info('Rendering index page')
    return render(request, 'index.html', {'api_url': settings.REACT_APP_API_URL})


# class DataUserAPIList(generics.ListCreateAPIView):
#     queryset = DataUser.objects.all()
#     serializer_class = DataUserSerializer
#     permission_classes = (IsAuthenticatedOrReadOnly, )
#
# class DataUserAPIUpdate(generics.RetrieveUpdateAPIView):
#     queryset = DataUser.objects.all()
#     serializer_class = DataUserSerializer
#     permission_classes = (IsAuthenticated, )
#     authentication_classes = (TokenAuthentication, )
#
# class DataUserAPIDestroy(generics.RetrieveDestroyAPIView):
#     queryset = DataUser.objects.all()
#     serializer_class = DataUserSerializer
#     permission_classes = (IsAdminOrReadOnly, )