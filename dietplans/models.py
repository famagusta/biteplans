''' this script creates models (classes) for representing
    diets '''
from django.db import models
from authentication.models import Account
from recipes.models import Recipe
from imported_recipes.models import ImportedRecipe
from ingredients.models import Ingredient, IngredientCommonMeasures

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
import math


class DietPlan(models.Model):
    ''' model for specifying a general diet plan- name,
        url??, creator, goal, description, duration, age,
        gender, unit system, height, weight'''
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=191)
    creator = models.ForeignKey(Account, on_delete=models.CASCADE,
                                related_name="createdfrom")
    goal = models.CharField(max_length=191, null=True)
    description = models.TextField(null=True)
    duration = models.IntegerField()
    age = models.DecimalField(max_digits=11, decimal_places=3, null=True)
    gender = models.CharField(max_length=20, null=True)
    height = models.DecimalField(max_digits=11, decimal_places=3, null=True)
    weight = models.DecimalField(max_digits=11, decimal_places=3, null=True)

    def __unicode__(self):
        '''string repr of the object'''
        return self.name

    class Meta:
        '''name db table'''
        db_table = 'dietplans_dietplan'


class DayPlan(models.Model):
    '''model to store one days diet plan'''
    id = models.AutoField(primary_key=True)
    diet = models.ForeignKey(DietPlan, on_delete=models.CASCADE,
                             related_name="dayplan")
    week_no = models.IntegerField()
    day_no = models.IntegerField()
    name = models.TextField()

    def __unicode__(self):
        '''string repr of the object'''
        return_string = "Day {0}, Week {1} for Plan {2}"
        return return_string.format(self.day_no, self.week_no, self.diet)

    class Meta:
        '''name db table'''
        db_table = 'dietplans_dayplan'


class MealPlan(models.Model):
    '''model to store one meals plan'''
    id = models.AutoField(primary_key=True)
    day = models.ForeignKey(DayPlan, on_delete=models.CASCADE,
                            related_name="mealplan")
    name = models.CharField(max_length=191)
    time = models.TimeField()

    def __unicode__(self):
        '''string repr of the object'''
        return_name = "meal {0} for {1}"
        return return_name.format(self.name, self.day)

    class Meta:
        '''name db table'''
        db_table = 'dietplans_mealplan'


class MealRecipe(models.Model):
    '''model to connect meals to recipes'''
    id = models.AutoField(primary_key=True)
    meal_plan = models.ForeignKey(MealPlan, on_delete=models.CASCADE,
                                  related_name="mealrecipe")
    reciple = models.ForeignKey(Recipe, on_delete=models.CASCADE,
                                related_name="recipe")
    no_of_servings = models.DecimalField(max_digits=11, decimal_places=3)

    def __unicode__(self):
        '''string repr of the object'''
        return 'Meal Recipe for %s' %self.meal_plan

    class Meta:
        '''name db table'''
        db_table = 'dietplans_mealrecipe'


class MealIngredient(models.Model):
    '''model to connect meals to recipes'''
    id = models.AutoField(primary_key=True)
    meal_plan = models.ForeignKey(MealPlan, on_delete=models.CASCADE,
                                  related_name="mealingredient")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE,
                                   related_name="meal_ingredient")
    quantity = models.DecimalField(max_digits=11, decimal_places=3)
    unit = models.ForeignKey(IngredientCommonMeasures,
                             on_delete=models.CASCADE,
                             related_name="meal_ing_qty")

    def __unicode__(self):
        '''string repr of the object'''
        return 'Meal Ingredient for %s' %self.meal_plan

    class Meta:
        '''name db table'''
        db_table = 'dietplans_mealingredient'


@receiver(post_save, sender=DietPlan)
def create_dayplan(sender, instance, created, **kwargs):
    '''assosiate one to one calender to the user instance'''
    if created:
        num_of_days = int(math.ceil(instance.duration*7))
        for i in range(num_of_days):
            DayPlan.objects.create(diet=instance, day_no=i+1, week_no=(i/7)+1,
                                   name="Week "+str(i/7+1)+" Day "+str(i+1)
                                   + " of DietPlan "+instance.name)

@receiver(post_save, sender=DayPlan)
def create_mealplan(sender, instance, created, **kwargs):
    '''assosiate one to one calender to the user instance'''
    if created:
        MealPlan.objects.create(day=instance, name="Breakfast", time="10:00:00")
        MealPlan.objects.create(day=instance, name="Lunch", time="14:00:00")
        MealPlan.objects.create(day=instance, name="Snacks", time="18:00:00")
        MealPlan.objects.create(day=instance, name="Dinner", time="21:00:00")
        