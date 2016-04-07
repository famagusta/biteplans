'''models for managing a users food calendar'''
from django.db import models

from authentication.models import Account
from dietplans.models import DietPlan, MealPlan
from recipes.models import Recipe
from ingredients.models import Ingredient


# TODO: incorporate feature to prevent overlapping dietplans
# check before starting another dietplan

class UserPlanHistory(models.Model):
    '''model stores calender associated with each user.
       based on django-scheduler'''
    # each calendar is in a one to one relation with a user
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    dietplan = models.ForeignKey(DietPlan, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    # if the user want to start a second dietplan in the middle of an existing
    # one, then deactivate the existing one and start the next
    is_active = models.BooleanField(default=True)

    def __unicode__(self):
        '''string repr of the object'''
        return self.user.username

    class Meta:
        '''name db table'''
        db_table = 'plan_calendar_history'


class MealEvent(models.Model):
    '''Stores an event corresponding to a meal in a diet plan'''
    meal = models.ForeignKey(MealPlan, on_delete=models.CASCADE)
    planhistory = models.ForeignKey(UserPlanHistory, on_delete=models.CASCADE)


class EventIngredient(models.Model):
    ''' stores an ingredient from a meal plan and whether the user has ticked it
        in his dashboard'''
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    meal_event = models.ForeignKey(MealEvent, on_delete=models.CASCADE)
    is_checked = models.BooleanField(default=False)


class EventRecipe(models.Model):
    ''' stores an recipe from a meal plan and whether the user has ticked it
        in his dashboard'''
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    meal_event = models.ForeignKey(MealEvent, on_delete=models.CASCADE)
    is_checked = models.BooleanField(default=False)
