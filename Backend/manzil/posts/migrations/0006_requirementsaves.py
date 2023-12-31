# Generated by Django 4.2.6 on 2024-01-03 13:56

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('posts', '0005_requirment_profession'),
    ]

    operations = [
        migrations.CreateModel(
            name='RequirementSaves',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('requirement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='posts.requirment')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
