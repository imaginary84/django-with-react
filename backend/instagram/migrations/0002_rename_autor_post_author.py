# Generated by Django 4.1.2 on 2022-10-20 14:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("instagram", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="post",
            old_name="autor",
            new_name="author",
        ),
    ]