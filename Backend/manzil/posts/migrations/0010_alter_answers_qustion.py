# Generated by Django 4.2.6 on 2024-01-05 13:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0009_answers_ratinganswer_qustions'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answers',
            name='qustion',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers_to_question', to='posts.qustions'),
        ),
    ]