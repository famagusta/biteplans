# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import authentication.models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_account_image_path'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='image_path',
            field=models.ImageField(null=True, upload_to=authentication.models.upload_to, blank=True),
        ),
    ]
