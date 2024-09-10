### Запускаем в консоли команду:
```
ssh root@194.58.114.153
```
Пароль:
```
dFJLOFvuLm1b3jUh
```
### Заводим нового пользователя:
```
adduser alex пароль: 090981
```
### Присваиваем статус администратора:
```
usermod alex -aG sudo
```
### Переходим на учетку alex
```
su alex
```
### Переходим в корень проекта:
```
cd ~
```
### Обновляем пакеты:
```
sudo apt update
```
### Делаем необходимые установки:
```
sudo apt install python3-venv python3-pip postgresql nginx
```
### Запускаем nginx:
```
sudo systemctl start nginx
```
### Проверяем статус nginx:
```
sudo systemctl status nginx
```
### Устанавливаем проект:
```
git clone https://github.com/BogdashkinAS/Diplom.git
```
### Перейдем в папку репозитория где лежит manage.py:
```
cd Testing/backend/APIProject/APIProject
```
### Запускаем работу с БД:
```
sudo su postgres
```
### Потом:
```
psql
```
### Заводим пользователя postgres:
```
ALTER USER postgres WITH PASSWORD '090981';
```
### Создаем БД:
```
CREATE DATABASE test_user;
```
### Далее:
```
\q
```
### Далее:
```
exit
```
### Запускаем:
```
nano .env
```
### Проверяем наличие указанных настроек:
```
DB_ENGINE=django.db.backends.postgresql
DB_NAME=test_user
DB_USER=postgres
DB_PASSWORD=090981
DB_HOST=127.0.0.1
DB_PORT=5432
```
### Запускаем:
```
python3 -m venv env
```
### Включаем виртуальное окружение:
```
source env/bin/activate
```
### Устанавливаем пакеты:
```
pip install -r requirements.txt
```
### Проводим миграции:
```
python manage.py migrate
```
### Заводим админа:
```
python manage.py createsuperuser admin пароль: admin
```
### Проверяем работу сервера:
```
python manage.py runserver 0.0.0.0:8000
```
### Запускаем сервер на адресе: 
```
http://194.58.114.153:8000/
```
### Открываем:
```
nano settings.py
```
### Устанавливаем значение:
```
DEBUG=False
```
### Проверяем работу gunicorn:
```
gunicorn APIProject.wsgi -b 0.0.0.0:8000 
```
### Устанавливаем настройки gunicorn:
```
sudo nano /etc/systemd/system/gunicorn.service
```
### Копируем в файл настройки:
```
[Unit]
Description=gunicorn service
After=network.target

[Service]
User=alex
Group=www-data
WorkingDirectory=/home/alex/Diplom/backend/APIProject/APIProject
ExecStart=/home/alex/Diplom/backend/APIProject/APIProject/env/bin/gunicorn --access-logfile -\
    --workers 3 --bind unix:/home/alex/Diplom/backend/APIProject/APIProject/APIProject/gunicorn.sock APIProject.wsgi:application

[Install]
WantedBy=multi-user.target
```
### Запускаем gunicorn:
```
sudo systemctl start gunicorn
```
### Активируем gunicorn:
```
sudo systemctl enable gunicorn
```
### Проверяем статус gunicorn:
```
sudo systemctl status gunicorn
```
### Запускаем настройки nginx:
```
sudo nano /etc/nginx/sites-available/diplom
```
### Копируем в файл настройки:
```
server {
    listen 80;
    server_name 194.58.114.153;

    location /static/ {
        root /home/alex/Diplom/backend/APIProject/APIProject;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/alex/Diplom/backend/APIProject/APIProject/APIProject/gunicorn.sock;
    }
}
```
### Запускаем команду:
```
sudo ln -s /etc/nginx/sites-available/diplom /etc/nginx/sites-enabled
```
### Останавливаем nginx:
```
sudo systemctl stop nginx
```
### Запускаем nginx:
```
sudo systemctl start nginx
```
### Статус nginx:
```
sudo systemctl status nginx
```
### Изменяем настройки конфигурации:
```
sudo nano /etc/nginx/nginx.conf
```
user www-data; заменить на user alex;

### Прописываем команду для файервола:
```
sudo ufw allow 'Nginx Full'
```
### Запускаем сервер на хосте:
```
http://194.58.114.153/
```
### Структура проекта: 

## 1. Фронтенд:
 - файл .env содержит текущий URL облачного сервиса на Reg.ru (все API запросы идут на это адрес)

В папке src:
 - App.jsx - основной файл проекта
 - папка context содержит AuthContext.jsx с настройками дл работы с контекстными данными
 - папка components содержит следующие компоненты:
 - DeleteFile.jsx - удаление файла пользователем
 - DeleteFileAdmin.jsx - удаления файла администратором
 - DeleteUser.jsx - удаление пользователя
 - DownloadFile.jsx - скачивание файла
 - FileItem.jsx - основное меню для работы с файлом пользователя
 - GetFilesList.jsx - список файлов пользователя с возможностью загрузки нового файла
 - GetFilesListAdmin.jsx - список файлов пользователя при входе в систему под администратором
 - GetTokenUser.jsx - тестовый компонент (не используется)
 - GetUsersList.jsx - список пользователей
 - GetUsersList.css - стили к списку пользователей
 - LoginUser.jsx - аутентификация пользователя
 - Logout.jsx - разлогинивание администратора
 - LogoutToUser.jsx - разлогинивание пользователя
 - MainPage.jsx - главная страница приложения
 - RegistrationForm.jsx - форма регистрации
 - RegistrationForm.css - стили к форме регистрации
 - TestList.jsx - тестовый компонент (не используется)
 - UpdateFile.jsx - изменение названия и описания к файлу
 - UpdateFileAdmin.jsx - изменение названия и описания к файлу при входе в систему под администратором
 - UploadFile.jsx - загрузка нового файла
 - UserList.jsx - основное меню для работы с пользователем у администратора

## 2. Бэкенд:
 - APIProject - основная папка проекта
 - файл .env содержит текущие настройки БД
 - information.log - логи ошибок
 - папка dist - файлы сборки из фронтенда

 Подпапка APIProject - папка с основными настройками проекта:
 - urls.py - содержит все маршруты (каждый подписан за что отвечает)

 Подпапка api_tets содержит рабочий код приложения:
 - папка templates содержит шаблон index.html
 - models.py - содержит модель файла пользователя
 - views.py - содержит представления (каждый компонент подписан)

# Остальные файлы и компоненты проекта являются типовыми и не не нуждаются в подробном описании.
