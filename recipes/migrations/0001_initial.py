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
                ('energy_kcal', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('protein_tot', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('fat_tot', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('carbohydrate_tot', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('fiber_tot', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('sugar_tot', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('water', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
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
        migrations.CreateModel(
            name='RecipeNutrition',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('calcium_mg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('phosphorus_mg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('magnesium_mg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('iron_mg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('potassium_mg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('sodium_mg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('zinc_mg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('copper_mg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('manganese_mg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('selenium_mcg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('vitamin_a_iu', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('vitamin_a_rae_mcg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('retinol_mcg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('thiamine_mg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('riboflavin_mg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('niacin_mg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('total_b6_mg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('folic_acid_total_mcg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('vitamin_c_mg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('vitamin_b12_mcg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('vitamin_e_mg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('vitamin_d_mcg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('vitamin_k_mcg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('fa_sat_g', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('fa_mono_g', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('fa_poly_g', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('cholestrl_mg', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('recipe', models.OneToOneField(related_name='recipeNutritionInfo', to='recipes.Recipe')),
            ],
        ),
        migrations.CreateModel(
            name='RecipeRating',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('rating', models.PositiveSmallIntegerField(choices=[(1, b'One'), (2, b'Two'), (3, b'Three'), (4, b'Four'), (5, b'Five')])),
                ('recipe', models.ForeignKey(to='recipes.Recipe')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='reciperating',
            unique_together=set([('user', 'recipe')]),
        ),
        migrations.AlterUniqueTogether(
            name='recipeingredients',
            unique_together=set([('recipe', 'ingredient')]),
        ),
    ]
