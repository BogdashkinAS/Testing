# Generated by Django 5.0.4 on 2024-06-16 17:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_test', '0004_filemodel_download_link'),
    ]

    operations = [
        migrations.AlterField(
            model_name='filemodel',
            name='download_date',
            field=models.DateTimeField(null=True),
        ),
    ]
