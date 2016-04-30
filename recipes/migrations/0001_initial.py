# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings
import recipes.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ingredients', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=191)),
                ('description', models.TextField()),
                ('directions', models.TextField(null=True, blank=True)),
                ('prep_time', models.DurationField(null=True, blank=True)),
                ('cook_time', models.DurationField(null=True, blank=True)),
                ('servings', models.IntegerField()),
                ('source', models.CharField(max_length=191, null=True, blank=True)),
                ('url', models.URLField(max_length=400, null=True, blank=True)),
                ('date_published', models.DateField(auto_now_add=True)),
                ('image', models.ImageField(null=True, upload_to=recipes.models.upload_to, blank=True)),
                ('created_by', models.ForeignKey(related_name='created_recipe', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='RecipeIngredients',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('quantity', models.DecimalField(max_digits=11, decimal_places=3)),
                ('ingredient', models.ForeignKey(related_name='ingredient_of_recipe', to='ingredients.Ingredient')),
                ('measure', models.ForeignKey(related_name='measure_of_recipeingredient', blank=True, to='ingredients.IngredientCommonMeasures', null=True)),
                ('recipe', models.ForeignKey(related_name='recipeIngredients', to='recipes.Recipe')),
            ],
        ),
    ]
