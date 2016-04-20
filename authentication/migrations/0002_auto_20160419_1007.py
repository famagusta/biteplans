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
            name='bicep',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
        migrations.AddField(
            model_name='account',
            name='body_fat_percent',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
        migrations.AddField(
            model_name='account',
            name='calf',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
        migrations.AddField(
            model_name='account',
            name='chest',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
        migrations.AddField(
            model_name='account',
            name='date_of_birth',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='account',
            name='forearm',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
        migrations.AddField(
            model_name='account',
            name='gender',
            field=models.CharField(blank=True, max_length=1, null=True, choices=[(b'M', b'Male'), (b'F', b'Female')]),
        ),
        migrations.AddField(
            model_name='account',
            name='height',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
        migrations.AddField(
            model_name='account',
            name='hip',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
        migrations.AddField(
            model_name='account',
            name='neck',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
        migrations.AddField(
            model_name='account',
            name='shoulder',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
        migrations.AddField(
            model_name='account',
            name='thigh',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
        migrations.AddField(
            model_name='account',
            name='waist',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
        migrations.AddField(
            model_name='account',
            name='weight',
            field=models.DecimalField(null=True, max_digits=11, decimal_places=3, blank=True),
        ),
    ]
