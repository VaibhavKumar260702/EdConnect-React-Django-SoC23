# Generated by Django 4.2.2 on 2023-07-21 10:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_alter_attendance_sessions_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='Announcements',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('CourseCode', models.CharField(default='', max_length=6)),
                ('Date', models.DateField(auto_now_add=True)),
                ('Time', models.TimeField(default='')),
                ('description', models.TextField(default=None, max_length=800)),
                ('Ta', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='api.ta_info')),
            ],
        ),
    ]
