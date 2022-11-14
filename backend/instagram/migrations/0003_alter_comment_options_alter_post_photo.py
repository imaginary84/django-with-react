# Generated by Django 4.1.2 on 2022-11-11 22:10

from django.db import migrations
import imagekit.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ("instagram", "0002_rename_autor_post_author"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="comment",
            options={"ordering": ["id"]},
        ),
        migrations.AlterField(
            model_name="post",
            name="photo",
            field=imagekit.models.fields.ProcessedImageField(
                upload_to="instagram/post/%Y/%m/%d"
            ),
        ),
    ]