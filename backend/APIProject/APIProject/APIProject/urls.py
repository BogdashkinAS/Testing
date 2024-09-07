"""
URL configuration for APIProject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# from django.contrib import admin
# from django.urls import path, include
# from api_test.views import DataUserViewSet
# from rest_framework import routers
#
#
# router = routers.SimpleRouter()
# router.register(r'datauser', DataUserViewSet)
#
#
# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/v1/', include(router.urls)),  # http://127.0.0.1:8000/api/v1/women/
#     # path('api/v1/womenlist/', WomenViewSet.as_view({'get': 'list'})),
#     # path('api/v1/womenlist/<int:pk>/', WomenViewSet.as_view({'put': 'update'})),
# ]


from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path

from api_test.views import FileUploadView, UserListView, FileModelView, FileDownloadLinkView, DeleteUser, GetUserTokenView, GetUserById, UserUpdateSuperuserView, FileModelAPIUpdate, FileModelAPIDestroy, GetUserIdByToken
from api_test import views

# Create your views here.

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/upload-file/', FileUploadView.as_view(), name='upload_file'), # загрузка файла пользователем с токеном
    path('api/v1/alluser/', UserListView.as_view(), name='user_list'), # список всех юзеров
    path('api/v1/get-user-token/', GetUserTokenView.as_view(), name='token_id'), # получение token пользователя по его id
    path('api/v1/get-token-user-id/', GetUserIdByToken.as_view(), name='token_id'), # получение id пользователя по его token
    path('api/v1/user/<int:user_id>/', GetUserById.as_view(), name='get_user_by_id'), # получение данных пользователя по его id
    path('api/v1/toggle-admin/<int:user_id>/', UserUpdateSuperuserView.as_view(), name='toggle-admin'), # изменение значения "администратор"
    path('api/v1/update-file/<int:file_id>/', FileUploadView.as_view(), name='update_file'), # update файла
    path('api/v1/delete-file/<int:file_id>/', FileUploadView.as_view(), name='delete_file'), # delete файла
    path('api/v1/delete-user/<int:user_id>/', DeleteUser.as_view(), name='delete_user'), # delete user только для администратора
    path('api/v1/media/<int:user_id>/', FileModelView.as_view(), name='file_user_list'), # получение всех файлов юзера по id
    path('api/v1/download/<int:file_id>/', FileDownloadLinkView.download_link_file, name='download_file'), # генерация ссылки по id файла
    path('api/v1/update-file-admin/<int:file_id>/', FileModelAPIUpdate.as_view()), # update файла пользователя админом по id файла
    path('api/v1/delete-file-admin/<int:pk>/', FileModelAPIDestroy.as_view()), # delete файла пользователя админом по id файла
    path('api/v1/auth/', include('djoser.urls')),  # регистрация нового пользователя
    # path('api/v1/new/', views.index, name='index'),
    re_path(r'^auth/', include('djoser.urls.authtoken')),  # new
    re_path(r'^.*$', views.index, name='index'),
    # path('api/v1/auth/users/'), ??? Все пользователи через токен админа
    # path('api/v1/reg/', include('rest_framework.urls')), # вход зарегистрированного user через сессию
    # path('api/v1/alluser/<int:user_id>/', FileModelView.as_view(), name='upload_file'), # хранилище юзера по id
    # path('api/v1/download/file/<int:file_id>/', download_file, name='download_files'), # генерация ссылки по id файла
    # path('api/v1/datauserlist/', DataUserAPIList.as_view()),
    # path('api/v1/datauserlist/<int:pk>/', DataUserAPIUpdate.as_view()),
    # path('api/v1/datauserdelete/<int:pk>/', DataUserAPIDestroy.as_view()),
]
# if settings.DEBUG:
#     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT, show_indexes=True)
# if settings.DEBUG:
#     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
# urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/v1/datauserlist/', DataUserAPIList.as_view()), # доступен GET по всем записям и POST на новую запись
#     path('api/v1/datauserlist/<int:pk>/', DataUserAPIUpdate.as_view()), # доступен PUT записи по номеру ID
#     path('api/v1/datauserdetail/<int:pk>/', DataUserAPIDetailView.as_view()), # доступен GET, PUT, DELETE записи по номеру ID
# ]