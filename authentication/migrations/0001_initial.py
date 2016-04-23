# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(null=True, verbose_name='last login', blank=True)),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(max_length=100)),
                ('email', models.EmailField(unique=True, max_length=254)),
                ('is_staff', models.BooleanField(default=False)),
                ('date_joined', models.DateTimeField(auto_now=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('social_thumb', models.URLField(null=True, blank=True)),
                ('activation_key', models.CharField(max_length=40, null=True)),
                ('key_expires', models.DateTimeField(null=True)),
                ('weight', models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True)),
                ('height', models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True)),
                ('date_of_birth', models.DateField(null=True, blank=True)),
                ('gender', models.CharField(blank=True, max_length=1, null=True, choices=[(b'M', b'Male'), (b'F', b'Female')])),
                ('body_fat_percent', models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True)),
                ('neck', models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True)),
                ('shoulder', models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True)),
                ('bicep', models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True)),
                ('forearm', models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True)),
                ('chest', models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True)),
                ('waist', models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True)),
                ('hip', models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True)),
                ('thigh', models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True)),
                ('calf', models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True)),
                ('groups', models.ManyToManyField(related_query_name='user', related_name='user_set', to='auth.Group', blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(related_query_name='user', related_name='user_set', to='auth.Permission', blank=True, help_text='Specific permissions for this user.', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
