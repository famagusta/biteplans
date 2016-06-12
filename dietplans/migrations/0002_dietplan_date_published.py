# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('dietplans', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='dietplan',
            name='date_published',
            field=models.DateField(default=datetime.date(2016, 6, 12), auto_now_add=True),
            preserve_default=False,
        ),
    ]
