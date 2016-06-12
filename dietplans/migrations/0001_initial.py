# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '__first__'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ingredients', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='DayPlan',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('week_no', models.IntegerField()),
                ('day_no', models.IntegerField()),
                ('name', models.TextField()),
            ],
            options={
                'db_table': 'dietplans_dayplan',
            },
        ),
        migrations.CreateModel(
            name='DietPlan',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=191)),
                ('goal', models.CharField(max_length=191, null=True)),
                ('description', models.TextField(null=True)),
                ('duration', models.IntegerField()),
                ('age', models.DecimalField(null=True, max_digits=11, decimal_places=3)),
                ('gender', models.CharField(max_length=20, null=True)),
                ('height', models.DecimalField(null=True, max_digits=11, decimal_places=3)),
                ('weight', models.DecimalField(null=True, max_digits=11, decimal_places=3)),
                ('energy_kcal', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('protein_tot', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('fat_tot', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('carbohydrate_tot', models.DecimalField(default=0.0, max_digits=11, decimal_places=3)),
                ('creator', models.ForeignKey(related_name='createdfrom', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'dietplans_dietplan',
            },
        ),
        migrations.CreateModel(
            name='MealIngredient',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('quantity', models.DecimalField(max_digits=11, decimal_places=3)),
                ('ingredient', models.ForeignKey(related_name='meal_ingredient', to='ingredients.Ingredient')),
            ],
            options={
                'db_table': 'dietplans_mealingredient',
            },
        ),
        migrations.CreateModel(
            name='MealPlan',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=191)),
                ('time', models.TimeField()),
                ('day', models.ForeignKey(related_name='mealplan', to='dietplans.DayPlan')),
            ],
            options={
                'db_table': 'dietplans_mealplan',
            },
        ),
        migrations.CreateModel(
            name='MealRecipe',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('servings', models.DecimalField(max_digits=11, decimal_places=3)),
                ('meal_plan', models.ForeignKey(related_name='mealrecipe', to='dietplans.MealPlan')),
                ('recipe', models.ForeignKey(related_name='meal_recipe', to='recipes.Recipe')),
            ],
            options={
                'db_table': 'dietplans_mealrecipe',
            },
        ),
        migrations.CreateModel(
            name='PlanRating',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('rating', models.PositiveSmallIntegerField(choices=[(1, b'One'), (2, b'Two'), (3, b'Three'), (4, b'Four'), (5, b'Five')])),
                ('dietPlan', models.ForeignKey(to='dietplans.DietPlan')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='mealingredient',
            name='meal_plan',
            field=models.ForeignKey(related_name='mealingredient', to='dietplans.MealPlan'),
        ),
        migrations.AddField(
            model_name='mealingredient',
            name='unit',
            field=models.ForeignKey(related_name='meal_ing_qty', to='ingredients.IngredientCommonMeasures'),
        ),
        migrations.AddField(
            model_name='dayplan',
            name='diet',
            field=models.ForeignKey(related_name='dayplan', to='dietplans.DietPlan'),
        ),
        migrations.AlterUniqueTogether(
            name='planrating',
            unique_together=set([('user', 'dietPlan')]),
        ),
        migrations.AlterUniqueTogether(
            name='mealrecipe',
            unique_together=set([('meal_plan', 'recipe')]),
        ),
        migrations.AlterUniqueTogether(
            name='mealplan',
            unique_together=set([('day', 'time')]),
        ),
        migrations.AlterUniqueTogether(
            name='mealingredient',
            unique_together=set([('meal_plan', 'ingredient')]),
        ),
    ]
