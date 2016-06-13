# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plan_calendar', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='mealhistory',
            unique_together=set([('user', 'date', 'time')]),
        ),
    ]
