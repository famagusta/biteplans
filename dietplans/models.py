''' this script creates models (classes) for representing
    diets '''
from django.db import models
from authentication.models import Account
from recipes.models import Recipe
from imported_recipes.models import ImportedRecipe


# Create your models here.
class DietPlan(models.Model):
    ''' model for specifying a general diet plan- name,
        url??, creator, goal, description, duration, age,
        gender, unit system, height, weight'''
    id = models.AutoField(primary_key=True)
    name = models.CharField(null=True, blank=False, max_length=191)
    creator = models.ForeignKey(Account, on_delete=models.CASCADE,
                                related_name="createdfrom")
    goal = models.CharField(max_length=191)
    description = models.TextField()
    duration = models.IntegerField()
    age = models.DecimalField(max_digits=11, decimal_places=3)
    gender = models.CharField(max_length=20)
    height = models.DecimalField(max_digits=11, decimal_places=3)
    weight = models.DecimalField(max_digits=11, decimal_places=3)

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
        return self.name

    class Meta:
        '''name db table'''
        db_table = 'dietplans_dayplan'

class MealPlan(models.Model):
    '''model to store one meals plan'''
    id = models.AutoField(primary_key=True)
    day = models.ForeignKey(DayPlan, on_delete=models.CASCADE,
                            related_name="mealplan")
    name = models.CharField(max_length=191)

    def __unicode__(self):
        '''string repr of the object'''
        return self.name

    class Meta:
        '''name db table'''
        db_table = 'dietplans_mealplan'


class MealRecipe(models.Model):
    '''model to connect meals to recipes'''
    id = models.AutoField(primary_key=True)
    meal_plan = models.ForeignKey(MealPlan, on_delete=models.CASCADE,
                                  related_name="mealrecipe")
    reciple = models.ForeignKey(ImportedRecipe, on_delete=models.CASCADE,
                                related_name="recipe")
    def __unicode__(self):
        '''string repr of the object'''
        return 'Meal Recipe for %s mealplan' %self.id

    class Meta:
        '''name db table'''
        db_table = 'dietplans_mealrecipe'
