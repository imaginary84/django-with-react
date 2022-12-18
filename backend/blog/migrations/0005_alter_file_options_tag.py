# Generated by Django 4.1.2 on 2022-11-29 12:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0004_remove_blog_image"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="file",
            options={"ordering": ["-id"]},
        ),
        migrations.CreateModel(
            name="Tag",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=50, unique=True)),
                (
                    "blog_set",
                    models.ManyToManyField(
                        blank=True, related_name="tag_set", to="blog.blog"
                    ),
                ),
            ],
        ),
    ]