''' this script creates models (classes) for representing
    diets '''
from django.db import models
from authentication.models import Account
from recipes.models import Recipe
from imported_recipes.models import ImportedRecipe
from ingredients.models import Ingredient, IngredientCommonMeasures
from django.db.models import Avg
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
import math
import decimal


class DietPlan(models.Model):
    ''' model for specifying a general diet plan- name,
        url??, creator, goal, description, duration, age,
        gender, unit system, height, weight'''
    id = models.AutoField(primary_key=True)
    date_published = models.DateField(auto_now_add=True, blank=True)
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

    # keep on these major nutrition info of entire dietplans
    # energy content of food in kilo calories
    energy_kcal = models.DecimalField(max_digits=11,
                                      decimal_places=3,
                                      default=0.00)
    # protein content in food in grams
    protein_tot = models.DecimalField(default=0.00,
                                      max_digits=11,
                                      decimal_places=3)
    # total fat (sat + unsat) content in food in grams
    fat_tot = models.DecimalField(default=0.00,
                                  max_digits=11,
                                  decimal_places=3)
    # total carbohydrate content (all sugars + fiber) in food in grams
    carbohydrate_tot = models.DecimalField(default=0.00,
                                           max_digits=11,
                                           decimal_places=3)

    def __unicode__(self):
        '''string repr of the object'''
        return self.name

    class Meta:
        '''name db table'''
        db_table = 'dietplans_dietplan'

    @property
    def average_rating(self):
        avg_rating = PlanRating.objects.filter(dietPlan__id=self.id)\
            .aggregate(Avg('rating'))['rating__avg']
        if avg_rating is None:
            return 0
        else:
            return avg_rating
        
    @property
    def is_complete(self):
        #status = True;
        day_plans = DayPlan.objects.filter(diet__id=self.id);
        for day in day_plans:
            meal_plans = MealPlan.objects.filter(day__id=day.id)
            for meal in meal_plans:
                ingredients = MealIngredient.objects.filter(meal_plan__id=meal.id)
                recipes = MealRecipe.objects.filter(meal_plan__id=meal.id)
                if len(ingredients)==0 and len(recipes)==0:
                    return False
        return True
                


class PlanRating(models.Model):
    user = models.ForeignKey(Account)
    dietPlan = models.ForeignKey(DietPlan)

    STAR_CONVERSION = (
        (1, 'One'),
        (2, 'Two'),
        (3, 'Three'),
        (4, 'Four'),
        (5, 'Five'),
        )

    rating = models.PositiveSmallIntegerField(choices=STAR_CONVERSION)

    class Meta:
        '''users must have only one rating per dietplan'''
        unique_together = ('user', 'dietPlan')


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
        unique_together = ('day', 'time')
        db_table = 'dietplans_mealplan'


class MealRecipe(models.Model):
    '''model to connect meals to recipes'''
    id = models.AutoField(primary_key=True)
    meal_plan = models.ForeignKey(MealPlan, on_delete=models.CASCADE,
                                  related_name="mealrecipe")
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE,
                               related_name="meal_recipe")
    servings = models.DecimalField(max_digits=11, decimal_places=3)

    def __unicode__(self):
        '''string repr of the object'''
        return 'Meal Recipe for %s' % self.meal_plan

    class Meta:
        '''name db table'''
        unique_together = ('meal_plan', 'recipe')
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
        return 'Meal Ingredient for %s' % self.meal_plan

    class Meta:
        '''name db table'''
        unique_together = ('meal_plan', 'ingredient')
        db_table = 'dietplans_mealingredient'


@receiver(post_save, sender=DietPlan)
def create_dayplan(sender, instance, created, **kwargs):
    '''assosiate one to one calender to the user instance'''
    if created:
        num_of_days = int(math.ceil(instance.duration*7))
        for i in range(num_of_days):
            day = (i % 7) + 1
            week = (i / 7) + 1
            DayPlan.objects.create(diet=instance, day_no=day, week_no=week,
                                   name="Week "+str(i/7+1)+" Day "+str(i+1)
                                   + " of DietPlan "+instance.name)


@receiver(post_save, sender=DayPlan)
def create_mealplan(sender, instance, created, **kwargs):
    '''assosiate one to one calender to the user instance'''
    if created:
        MealPlan.objects.create(day=instance,
                                name="Breakfast",
                                time="08:00:00")
        MealPlan.objects.create(day=instance,
                                name="Lunch",
                                time="13:00:00")
        MealPlan.objects.create(day=instance,
                                name="Snacks",
                                time="17:00:00")
        MealPlan.objects.create(day=instance,
                                name="Dinner",
                                time="20:00:00")


# ek teer se do shikaar - ;-)
@receiver(post_save)
@receiver(post_delete)
def save_plan_nutrition(sender, instance, *args, **kwargs):
    # update diet plan macros on addition of recipe or ingredient
    list_of_models = ('MealRecipe', 'MealIngredient')
    # update the nutrition whenever mealrecipe or mealingredient is saved
    if sender.__name__ in list_of_models:
        sortlist = DietPlan._meta.fields
        nutrient_field = []
        nutrient_list = ['dietplans.DietPlan.energy_kcal',
                         'dietplans.DietPlan.protein_tot',
                         'dietplans.DietPlan.fat_tot',
                         'dietplans.DietPlan.carbohydrate_tot']
        for i in sortlist:
            if str(type(i)) == "<class 'django.db.models.fields.DecimalField'>" and\
                    str(i) in nutrient_list:
                nutrient_field.append(i)
        diet = instance.meal_plan.day.diet
        day_plans = diet.dayplan.all()

        # reset everything to 0 - its easier this way
        for i in nutrient_field:
            if hasattr(diet, i.name):
                setattr(diet, i.name, 0.000)
        diet.save()

        for day_plan in day_plans:
            # iterate over all day plans in a dietplan
            meal_plans = day_plan.mealplan.all()
            for meal_plan in meal_plans:
                # iterate over all meal plans in a day

                # get all recipes and ingredients of a day
                meal_recipes = meal_plan.mealrecipe.all()
                meal_ingredients = meal_plan.mealingredient.all()

                for meal_recipe in meal_recipes:
                    # calculation for all recipes
                    for nutrient in nutrient_field:
                        old = getattr(diet, nutrient.name)
                        old = decimal.Decimal(old)
                        servings = meal_recipe.servings
                        recipe_attr = getattr(meal_recipe.recipe,
                                              nutrient.name)
                        value_to_set = old + (servings*recipe_attr)
                        setattr(diet, nutrient.name, value_to_set)

                for meal_ingredient in meal_ingredients:
                    # calculation for all ingredients
                    for nutrient in nutrient_field:
                        old = getattr(diet, nutrient.name)
                        old = decimal.Decimal(old)
                        quantity = meal_ingredient.quantity
                        ingred_attr = getattr(meal_ingredient.ingredient,
                                              nutrient.name)
                        value_to_set = old + (quantity*ingred_attr *
                                              decimal.Decimal(meal_ingredient.unit.weight / 100))
                        setattr(diet, nutrient.name, value_to_set)

        # update database
        diet.save()
