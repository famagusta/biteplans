'''models for managing a users food calendar'''
from django.db import models

from authentication.models import Account
from dietplans.models import DietPlan, MealPlan, MealIngredient,\
    MealRecipe
from ingredients.models import Ingredient, IngredientCommonMeasures
from recipes.models import Recipe


class UserPlanHistory(models.Model):
    '''model stores calender associated with each user.
       based on django-scheduler'''
    # each calendar is in a one to one relation with a user
    user = models.ForeignKey(Account, on_delete=models.CASCADE)

    # Even if the dietplan is deleted. let the populated
    # meal history remain. COOL!!
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
    '''Stores a users meal history
       - logged meals or that from a plan history'''
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    name = models.CharField(default="Ad Hoc Meal", max_length=191)
    user_dietplan = models.ForeignKey(UserPlanHistory,
                                      on_delete=models.CASCADE)
    date_time = models.DateTimeField()
    updated_on = models.DateTimeField()


class EventIngredient(models.Model):
    ''' stores an ingredient from a meal plan or log for a given day
        and whether the user has ticked it in his dashboard'''
    meal_history = models.ForeignKey(MealHistory, on_delete=models.CASCADE)
    meal_ingredient = models.ForeignKey(Ingredient,
                                        on_delete=models.CASCADE)
    is_checked = models.BooleanField(default=False)
    quantity = models.DecimalField(max_digits=11, decimal_places=3)
    unit_desc = models.ForeignKey(IngredientCommonMeasures,
                                  on_delete=models.CASCADE,
                                  related_name="evnt_meal_ing_qty")


class EventRecipe(models.Model):
    ''' stores an recipe from a meal plan or log for a given day
        and whether the user has ticked it in his dashboard'''
    meal_recipe = models.ForeignKey(MealRecipe, on_delete=models.CASCADE)
    meal_history = models.ForeignKey(MealHistory, on_delete=models.CASCADE)
    is_checked = models.BooleanField(default=False)
    no_of_servings = models.DecimalField(max_digits=11, decimal_places=3)
