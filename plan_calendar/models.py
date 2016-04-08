'''models for managing a users food calendar'''
from django.db import models

from authentication.models import Account
from dietplans.models import DietPlan, MealPlan, MealIngredient,\
    MealRecipe
from ingredients.models import Ingredient, IngredientCommonMeasures
# TODO: incorporate feature to prevent overlapping dietplans
# check before starting another dietplan


class UserPlanHistory(models.Model):
    '''model stores calender associated with each user.
       based on django-scheduler'''
    # each calendar is in a one to one relation with a user
    user = models.ForeignKey(Account, on_delete=models.CASCADE)

    # TODO: maybe we need to rethink on_delete option here.
    # the user should not lose the diet plan if someone deletes it

    dietplan = models.ForeignKey(DietPlan, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    created_on = models.DateTimeField()
    updated_on = models.DateTimeField()

    # if the user want to start a second dietplan in the middle of an existing
    # one, then deactivate the existing one and start the next
    is_active = models.BooleanField(default=True)

    def __unicode__(self):
        '''string repr of the object'''
        return self.user.username

    class Meta:
        '''name db table'''
        db_table = 'plan_calendar_history'


class MealHistory(models.Model):
    '''Stores an event corresponding to a meal in a diet plan'''
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    dietplan = models.ForeignKey(DietPlan, on_delete=models.CASCADE)
    date = models.DateTimeField()


class MealDetails(models.Model):
    '''stores details of a particular meal that the user entered'''
    name = models.CharField(default="Ad Hoc Meal", max_length=191)
    meal_history = models.ForeignKey(MealHistory, on_delete=models.CASCADE)
    start_time = models.TimeField()


class EventIngredient(models.Model):
    ''' stores an ingredient from a meal plan and whether the user has ticked it
        in his dashboard'''
    meal_ingredient = models.ForeignKey(MealIngredient,
                                        on_delete=models.CASCADE)
    meal = models.ForeignKey(MealDetails, on_delete=models.CASCADE)
    is_checked = models.BooleanField(default=False)
    quantity = models.DecimalField(max_digits=11, decimal_places=3)
    # TODO: is there a way we can constrain this to match the ingredient
    # in question
    unit = models.ForeignKey(IngredientCommonMeasures,
                             on_delete=models.CASCADE,
                             related_name="evnt_meal_ing_qty")


class EventRecipe(models.Model):
    ''' stores an recipe from a meal plan and whether the user has ticked it
        in his dashboard'''
    meal_recipe = models.ForeignKey(MealRecipe, on_delete=models.CASCADE)
    meal = models.ForeignKey(MealDetails, on_delete=models.CASCADE)
    is_checked = models.BooleanField(default=False)
    no_of_servings = models.DecimalField(max_digits=11, decimal_places=3)
