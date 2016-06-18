# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dietplans', '0004_auto_20160618_1106'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dietplan',
            name='age',
        ),
        migrations.RemoveField(
            model_name='dietplan',
            name='height',
        ),
        migrations.RemoveField(
            model_name='dietplan',
            name='weight',
        ),
    ]
