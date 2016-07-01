# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0002_descRecIng'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='serving_descriptor',
            field=models.CharField(max_length=191, null=True, blank=True),
        ),
    ]
