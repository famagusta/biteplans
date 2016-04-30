# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0004_auto_20160420_1134'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userdp',
            name='user',
        ),
        migrations.DeleteModel(
            name='UserDP',
        ),
    ]
