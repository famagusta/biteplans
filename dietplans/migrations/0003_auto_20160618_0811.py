# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dietplans', '0002_dietplan_date_published'),
    ]

    operations = [
        migrations.AddField(
            model_name='dietplan',
            name='activity_level',
            field=models.CharField(blank=True, max_length=3, null=True, choices=[(b'S', b'Sedentary'), (b'MA', b'Mild Activity'), (b'OA', b'Moderate Activity'), (b'HA', b'Heavy Activity'), (b'VHA', b'Very Heavy Activity')]),
        ),
        migrations.AddField(
            model_name='dietplan',
            name='lower_bmr',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3),
        ),
        migrations.AddField(
            model_name='dietplan',
            name='upper_bmr',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3),
        ),
    ]
