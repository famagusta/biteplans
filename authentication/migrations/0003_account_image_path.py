# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import authentication.models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_auto_20160420_1023'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='image_path',
            field=models.ImageField(default='user_profile_image/19/Robin _ panfront.jpg', upload_to=authentication.models.upload_to),
            preserve_default=False,
        ),
    ]
