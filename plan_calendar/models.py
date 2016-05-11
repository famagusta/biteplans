'''models for managing a users food calendar'''
from django.db import models
from authentication.models import Account
from dietplans.models import DietPlan, MealPlan, MealIngredient,\
    MealRecipe
from ingredients.models import Ingredient, IngredientCommonMeasures
from recipes.models import Recipe
from datetime import datetime, timedelta
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver

class UserPlanHistory(models.Model):
    '''model stores calender associated with each user.
       based on django-scheduler'''
    # each calendar is in a one to one relation with a user
    user = models.ForeignKey(Account, on_delete=models.CASCADE,
                             related_name="followed")

    # Even if the dietplan is deleted. let the populated
    # meal history remain. COOL!!
    dietplan = models.ForeignKey(DietPlan, null=True, on_delete=models.SET_NULL)
    start_date = models.DateField()
    created_on = models.DateTimeField()
    updated_on = models.DateTimeField()

    # if the user want to start a second dietplan in the middle of an existing
    # one, then deactivate the existing one and start the next
    is_active = models.BooleanField(default=True)

    def __unicode__(self):
        '''string repr of the object'''
        return self.user.username

    def save(self, **kwargs):
        if not self.id:
            # Edit created timestamp only if it's new entry
            self.created_on = datetime.now()
        self.updated_on = datetime.now()
        super(UserPlanHistory, self).save()

    class Meta:
        '''name db table'''
        db_table = 'plan_calendar_history'


class MealHistory(models.Model):
    '''Stores a users meal history
       - logged meals or that from a plan history'''
    user = models.ForeignKey(Account, on_delete=models.CASCADE,
                             related_name="userSchedule")
    name = models.CharField(default="Ad Hoc Meal", max_length=191)
    user_dietplan = models.ForeignKey(UserPlanHistory,
                                      on_delete=models.CASCADE,
                                      related_name="FollowPlanMealPlans",
                                      null=True)
    user_mealplan = models.ForeignKey(MealPlan, on_delete=models.CASCADE)

    date = models.DateField()
    time = models.TimeField()
    updated_on = models.DateTimeField()

    class Meta:
      '''unique fields composite'''
      unique_together = ('date', 'time')

    def save(self, **kwargs):
        self.updated_on = datetime.now()
        super(MealHistory, self).save()


class EventIngredient(models.Model):
    ''' stores an ingredient from a meal plan or log for a given day
        and whether the user has ticked it in his dashboard'''
    meal_history = models.ForeignKey(MealHistory, on_delete=models.CASCADE,
                                     related_name="followingMealPlanIngredient")
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
    meal_history = models.ForeignKey(MealHistory, on_delete=models.CASCADE,
                                     related_name="followingMealPlanRecipe")
    is_checked = models.BooleanField(default=False)
    no_of_servings = models.DecimalField(max_digits=11, decimal_places=3)


class UserLoggedIngredient(models.Model):
    '''stores ingredients logged of bookmarked by users'''
    user = models.ForeignKey(Account, on_delete=models.CASCADE,
                             related_name="loggedIngredients")
    meal_ingredient = models.ForeignKey(Ingredient,
                                        on_delete=models.CASCADE)
    is_checked = models.BooleanField(default=False)
    quantity = models.DecimalField(max_digits=11, decimal_places=3)
    unit_desc = models.ForeignKey(IngredientCommonMeasures,
                                  on_delete=models.CASCADE,
                                  related_name="logged_ing_qty")
    date_time = models.DateTimeField(unique=True)


class UserLoggedRecipe(models.Model):
    '''stores recipes logged of bookmarked by users'''
    meal_recipe = models.ForeignKey(MealRecipe, on_delete=models.CASCADE)
    user = models.ForeignKey(Account, on_delete=models.CASCADE,
                             related_name="loggedrecipes")
    is_checked = models.BooleanField(default=False)
    no_of_servings = models.DecimalField(max_digits=11, decimal_places=3)
    date_time = models.DateTimeField(unique=True)



@receiver(post_save, sender=UserPlanHistory)
def assosiate_mealhistory(sender, instance, created, **kwargs):
    if created:
        diet = instance.dietplan
        daylist = diet.dayplan.all()

        for i in range(len(daylist)):
            mealplanarr = daylist[i].mealplan.all()
            for j in range(len(mealplanarr)):
                date = instance.start_date + timedelta(
                          days=(daylist[i].day_no) - \
                          1 + (daylist[i].week_no - 1) * 7)
                time = mealplanarr[j].time
                MealHistory.objects.create(name=mealplanarr[j].name,
                                           user=instance.user,
                                           user_dietplan=instance,
                                           user_mealplan=mealplanarr[j],
                                           date=date,
                                           time=time)

@receiver(post_save, sender=MealHistory)
def assosiate_mealingres(sender, instance, created, **kwargs):
    if created:
        mealplan = instance.user_mealplan
        mealingredient = mealplan.mealingredient
        mealrecipe = mealplan.mealrecipe

        for i in mealingredient.all():
            EventIngredient.objects.create(meal_history=instance,
                                           meal_ingredient=i.ingredient,
                                           quantity=i.quantity,
                                           unit_desc=i.unit
                                           )

        for i in mealrecipe.all():
            EventRecipe.objects.create(meal_history=instance,
                                       meal_recipe=i.reciple,
                                       no_of_servings=i.no_of_servings
                                       )


