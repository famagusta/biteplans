# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_account_activity_level'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='goal_weight',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
    ]
