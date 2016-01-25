# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bitespace_app', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='usdaingredient',
            old_name='food_id',
            new_name='id',
        ),
    ]
