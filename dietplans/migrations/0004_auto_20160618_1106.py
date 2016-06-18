# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dietplans', '0003_auto_20160618_0811'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dietplan',
            name='age',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
        migrations.AlterField(
            model_name='dietplan',
            name='gender',
            field=models.CharField(blank=True, max_length=6, null=True, choices=[(b'Male', b'Male'), (b'Female', b'Female'), (b'All', b'All')]),
        ),
        migrations.AlterField(
            model_name='dietplan',
            name='height',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
        migrations.AlterField(
            model_name='dietplan',
            name='lower_bmr',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
        migrations.AlterField(
            model_name='dietplan',
            name='upper_bmr',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
        migrations.AlterField(
            model_name='dietplan',
            name='weight',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
    ]
