# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '__first__'),
        ('dietplans', '0002_dietplan_date_published'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ingredients', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventIngredient',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('is_checked', models.BooleanField(default=False)),
                ('quantity', models.DecimalField(max_digits=11, decimal_places=3)),
            ],
        ),
        migrations.CreateModel(
            name='EventRecipe',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('is_checked', models.BooleanField(default=False)),
                ('no_of_servings', models.DecimalField(max_digits=11, decimal_places=3)),
            ],
        ),
        migrations.CreateModel(
            name='MealHistory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'Ad Hoc Meal', max_length=191)),
                ('date', models.DateField()),
                ('time', models.TimeField()),
                ('updated_on', models.DateTimeField()),
                ('user', models.ForeignKey(related_name='userSchedule', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='MyIngredient',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ingredient', models.ForeignKey(to='ingredients.Ingredient')),
                ('user', models.ForeignKey(related_name='loggedIngredients', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='MyPlans',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('dietplan', models.ForeignKey(to='dietplans.DietPlan')),
                ('user', models.ForeignKey(related_name='loggedplans', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='MyRecipe',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('recipe', models.ForeignKey(to='recipes.Recipe')),
                ('user', models.ForeignKey(related_name='loggedrecipes', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserPlanHistory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('start_date', models.DateField()),
                ('created_on', models.DateTimeField()),
                ('updated_on', models.DateTimeField()),
                ('is_active', models.BooleanField(default=True)),
                ('dietplan', models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, to='dietplans.DietPlan', null=True)),
                ('user', models.ForeignKey(related_name='followed', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'plan_calendar_history',
            },
        ),
        migrations.AddField(
            model_name='mealhistory',
            name='user_dietplan',
            field=models.ForeignKey(related_name='FollowPlanMealPlans', on_delete=django.db.models.deletion.SET_NULL, to='plan_calendar.UserPlanHistory', null=True),
        ),
        migrations.AddField(
            model_name='mealhistory',
            name='user_mealplan',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, to='dietplans.MealPlan', null=True),
        ),
        migrations.AddField(
            model_name='eventrecipe',
            name='meal_history',
            field=models.ForeignKey(related_name='followingMealPlanRecipe', to='plan_calendar.MealHistory'),
        ),
        migrations.AddField(
            model_name='eventrecipe',
            name='meal_recipe',
            field=models.ForeignKey(to='recipes.Recipe'),
        ),
        migrations.AddField(
            model_name='eventingredient',
            name='meal_history',
            field=models.ForeignKey(related_name='followingMealPlanIngredient', to='plan_calendar.MealHistory'),
        ),
        migrations.AddField(
            model_name='eventingredient',
            name='meal_ingredient',
            field=models.ForeignKey(to='ingredients.Ingredient'),
        ),
        migrations.AddField(
            model_name='eventingredient',
            name='unit_desc',
            field=models.ForeignKey(related_name='evnt_meal_ing_qty', to='ingredients.IngredientCommonMeasures'),
        ),
        migrations.AlterUniqueTogether(
            name='myrecipe',
            unique_together=set([('user', 'recipe')]),
        ),
        migrations.AlterUniqueTogether(
            name='myplans',
            unique_together=set([('user', 'dietplan')]),
        ),
        migrations.AlterUniqueTogether(
            name='myingredient',
            unique_together=set([('user', 'ingredient')]),
        )
    ]
