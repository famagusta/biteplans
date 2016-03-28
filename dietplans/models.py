''' this script creates models (classes) for representing
    diets '''
from django.db import models
from authentication.models import Account
from recipes.models import Recipe


# Create your models here.
class DietPlan(models.Model):
    ''' model for specifying a general diet plan- name,
        url??, creator, goal, description, duration, age,
        gender, unit system, height, weight'''
    id = models.AutoField(primary_key=True)
    name = models.CharField(null=True, blank=False, max_length=191)
    creator = models.ForeignKey(Account, on_delete=models.CASCADE)
    goal = models.CharField(max_length=191)
    description = models.TextField()
    duration = models.IntegerField()
    age = models.DecimalField(max_digits=11, decimal_places=3)
    gender = models.CharField(max_length=20)
    height = models.DecimalField(max_digits=11, decimal_places=3)
    weight = models.DecimalField(max_digits=11, decimal_places=3)


class DayPlan(models.Model):
    '''model to store one days diet plan'''
    id = models.AutoField(primary_key=True)
    diet = models.ForeignKey(DietPlan, on_delete=models.CASCADE)
    week_no = models.IntegerField()
    day_no = models.IntegerField()


class MealPlan(models.Model):
    '''model to store one meals plan'''
    id = models.AutoField(primary_key=True)
    day = models.ForeignKey(DayPlan, on_delete=models.CASCADE)
    name = models.CharField(max_length=191)


class MealRecipe(models.Model):
    '''model to connect meals to recipes'''
    id = models.AutoField(primary_key=True)
    meal_plan = models.ForeignKey(MealPlan, on_delete=models.CASCADE)
    reciple = models.ForeignKey(Recipe, on_delete=models.CASCADE)
