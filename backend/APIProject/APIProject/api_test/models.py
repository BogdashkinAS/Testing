import os
import time

from django.contrib.auth.models import User
from django.db import models, transaction
from django.utils import timezone
from django.db.models import F

# Create your models here.

def user_directory_path(instance, filename):
    # Файл будет загружен в media/user_<id>/<filename>
    return '{0}/{1}'.format(instance.user.id, filename)

# class UserToken(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     token = models.CharField(max_length=255)

class FileModel(models.Model):
    name = models.CharField(max_length=100, null=True)
    file = models.FileField(upload_to=user_directory_path)
    size = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    description = models.CharField(max_length=255, blank=True) # Добавил максимальную длину для поля
    upload_date = models.DateTimeField(auto_now_add=True) # Исправил название поля
    download_date = models.CharField(null=True) # Исправил название поля
    download_link = models.CharField(max_length=100, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user} - {self.file}'

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.file.name
        if self.file:  # Убедимся, что файл был предоставлен перед присвоением размера
            self.size = self.file.size
        super().save(*args, **kwargs)

# class FileModel(models.Model):
#     name = models.CharField(max_length=100, null=True)
#     file = models.FileField(upload_to='media/')
#     size = models.DecimalField(max_digits=12, decimal_places=2, null=True)
#     description = models.CharField(blank=True)
#     created_data = models.DateTimeField(auto_now_add=True)
#     download_data = models.DateTimeField(auto_now=True)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#
#     def __str__(self):
#         return f'{self.user} - {self.file}'
#
#     # Метод для получения пути к файлу с учетом ID пользователя
#     def get_file_path(self):
#         return f'{self.user_id}/{self.file.name}'
#         # return f'media/{self.user_id}/{self.id}/{self.file.name}'
#
#     # Переопределение метода save для установки правильного пути к файлу
#     def save(self, *args, **kwargs):
#         if not self.name:
#             self.name = self.file.name
#         self.size = self.file.size
#         # self.file = self.get_file_path()
#         super().save(*args, **kwargs)

# class FileModel(models.Model):
#     name = models.CharField(max_length=100, null=True)
#     file = models.FileField(upload_to='media/')
#     size = models.DecimalField(max_digits=12, decimal_places=2, null=True)
#     description = models.CharField(max_length=100)
#     created_data = models.DateField(null=True)  # Изменено на DateField
#     download_data = models.DateField(null=True)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#
#     def save(self, *args, **kwargs):
#         if not self.created_data:
#             self.created_data = time.strftime('%Y-%m-%d')  # Изменено на формат даты ISO
#         if not self.name:
#             self.name = self.file.name
#         self.file.name = self.get_file_path()
#
#         try:
#             with transaction.atomic():
#                 super().save(*args, **kwargs)
#                 # Обновить поле download_data после сохранения файла
#                 self.download_data = time.strftime('%Y-%m-%d')  # Изменено на формат даты ISO
#                 # Обновить поле size после сохранения файла
#                 self.size = self.file.size
#                 self.save()
#         except:
#             pass
#
#     def str(self):
#         return f'{self.user} - {self.file}'
#
#     def get_file_path(self):
#         return f'{self.user_id}/{self.file.name}'
