# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='activity_level',
            field=models.CharField(blank=True, max_length=3, null=True, choices=[(b'S', b'Sedentary'), (b'MA', b'Mild Activity'), (b'OA', b'Moderate Activity'), (b'HA', b'Heavy Activity'), (b'VHA', b'Very Heavy Activity')]),
        ),
    ]
