from django.db import models
from datetime import datetime
from ingredients.models import Ingredient,\
    IngredientCommonMeasures, AddtnlIngredientInfo
from authentication.models import Account
from django.db.models.signals import pre_delete, pre_save, post_save
from django.dispatch.dispatcher import receiver
import decimal
from django.db.models import Avg


_UNSAVED_FILEFIELD = 'unsaved_filefield'


def upload_to(instance, filename):
    return 'photos/recipe_image/{}_{}'.format(instance.id, filename)


class Recipe(models.Model):
    '''Model to represent recipes created on biteplans
       by users and the inhouse team.
       NOT TO BE CONFUSED WITH RECIPE CLASS in
       ingredients'''
    id = models.AutoField(primary_key=True)

    # empty name is not allowed for recipe
    name = models.CharField(max_length=191)
    description = models.TextField()
    directions = models.TextField(null=True, blank=True)
    prep_time = models.DurationField(null=True, blank=True)
    cook_time = models.DurationField(null=True, blank=True)
    servings = models.IntegerField()
    source = models.CharField(null=True, blank=True, max_length=191)
    url = models.URLField(null=True, blank=True, max_length=400)
    # TODO: Handle case of saving recipe when user is deleted
    created_by = models.ForeignKey(Account, on_delete=models.CASCADE,
                                   related_name="created_recipe")
    date_published = models.DateField(auto_now_add=True, blank=True)
    image = models.ImageField(null=True, blank=True, upload_to=upload_to)

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

    # total fiber content in food in grams
    fiber_tot = models.DecimalField(max_digits=11,
                                    decimal_places=3,
                                    default=0.00)

    # total sugar content
    sugar_tot = models.DecimalField(default=0.00,
                                    max_digits=11,
                                    decimal_places=3)

    # moisture content of food in grams
    water = models.DecimalField(default=0.00,
                                max_digits=11,
                                decimal_places=3)

    def __unicode__(self):
        return self.name
    
    @property
    def average_rating(self):
        avg_rating = RecipeRating.objects.filter(recipe__id=self.id)\
            .aggregate(Avg('rating'))['rating__avg']
        if avg_rating is None:
            return 0
        else:
            return avg_rating

    
class RecipeRating(models.Model):
    user = models.ForeignKey(Account)
    recipe = models.ForeignKey(Recipe)

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
        unique_together = ('user', 'recipe')
    

class RecipeNutrition(models.Model):
    '''Model to keep track of recipe_info'''
    id = models.AutoField(primary_key=True)

    # empty name is not allowed for recipe
    recipe = models.OneToOneField(Recipe, on_delete=models.CASCADE,
                                  related_name="recipeNutritionInfo")

    # Metallic Minerals
    calcium_mg = models.DecimalField(default=0.00,
                                     max_digits=11,
                                     decimal_places=3)
    # phosphorous in mg
    phosphorus_mg = models.DecimalField(default=0.00,
                                        max_digits=11,
                                        decimal_places=3)
    # magnesium in mg
    magnesium_mg = models.DecimalField(default=0.00,
                                       max_digits=11,
                                       decimal_places=3)
    # iron in mg
    iron_mg = models.DecimalField(default=0.00,
                                  max_digits=11,
                                  decimal_places=3)
    potassium_mg = models.DecimalField(max_digits=11, decimal_places=3,
                                       default=0.00)
    sodium_mg = models.DecimalField(max_digits=11, decimal_places=3,
                                    default=0.00)
    zinc_mg = models.DecimalField(default=0.00,
                                  max_digits=11,
                                  decimal_places=3)
    copper_mg = models.DecimalField(default=0.00,
                                    max_digits=11,
                                    decimal_places=3)
    manganese_mg = models.DecimalField(default=0.00,
                                       max_digits=11,
                                       decimal_places=3)
    selenium_mcg = models.DecimalField(default=0.00,
                                       max_digits=11,
                                       decimal_places=3)
    # Vitamins
    # find out different types of vit a
    vitamin_a_iu = models.DecimalField(default=0.00,
                                       max_digits=11,
                                       decimal_places=3)
    vitamin_a_rae_mcg = models.DecimalField(default=0.00,
                                            max_digits=11,
                                            decimal_places=3)
    retinol_mcg = models.DecimalField(default=0.00,
                                      max_digits=11,
                                      decimal_places=3)
    thiamine_mg = models.DecimalField(default=0.00,
                                      max_digits=11,
                                      decimal_places=3)
    riboflavin_mg = models.DecimalField(default=0.00,
                                        max_digits=11,
                                        decimal_places=3)
    niacin_mg = models.DecimalField(default=0.00,
                                    max_digits=11,
                                    decimal_places=3)
    total_b6_mg = models.DecimalField(default=0.00,
                                      max_digits=11,
                                      decimal_places=3)
    folic_acid_total_mcg = models.DecimalField(default=0.00,
                                               max_digits=11,
                                               decimal_places=3)
    vitamin_c_mg = models.DecimalField(default=0.00,
                                       max_digits=11,
                                       decimal_places=3)
    vitamin_b12_mcg = models.DecimalField(default=0.00,
                                          max_digits=11,
                                          decimal_places=3)
    vitamin_e_mg = models.DecimalField(default=0.00,
                                       max_digits=11,
                                       decimal_places=3)
    vitamin_d_mcg = models.DecimalField(default=0.00,
                                        max_digits=11,
                                        decimal_places=3)
    vitamin_k_mcg = models.DecimalField(default=0.00,
                                        max_digits=11,
                                        decimal_places=3)

    # Lipids & Cholesterol
    fa_sat_g = models.DecimalField(default=0.00,
                                   max_digits=11,
                                   decimal_places=3)
    fa_mono_g = models.DecimalField(default=0.00,
                                    max_digits=11,
                                    decimal_places=3)
    fa_poly_g = models.DecimalField(default=0.00,
                                    max_digits=11,
                                    decimal_places=3)
    cholestrl_mg = models.DecimalField(max_digits=11, decimal_places=3,
                                       default=0.00)

    def __unicode__(self):
        return self.recipe.name + " Nutrition info"


class RecipeIngredients(models.Model):
    '''Model to match the one to many relationshsip
       between recipe & ingredients. One recipe will
       have multiple ingredients'''
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE,
                               related_name="recipeIngredients")

    # TODO: potential limitation here - redo the models for ingredients to make
    # it more general

    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE,
                                   related_name="ingredient_of_recipe")
    # units & quantity must not be empty ever
    # units could be a model of its own to make things standardized across apps
    measure = models.ForeignKey(IngredientCommonMeasures,
                                null=True, blank=True,
                                related_name="measure_of_recipeingredient")
    quantity = models.DecimalField(max_digits=11, decimal_places=3)
    # modifiers - optional description for the ingredients
    # modifiers = models.CharField(null=True, blank=True, max_length=191)

    def __unicode__(self):
        return self.ingredient.name

    def possible_measures(self):
        '''return set of measures possible for current ingredient'''
        measure_set = IngredientCommonMeasures.\
            objects.filter(ingred_id=self.ingredient)
        return measure_set

    class Meta:
        '''Meta details, defines a composite unique key'''
        unique_together = ('recipe', 'ingredient')



@receiver(pre_save, sender=Recipe)
def skip_saving_file(sender, instance, **kwargs):
    if not instance.pk and not hasattr(instance, _UNSAVED_FILEFIELD):
        setattr(instance, _UNSAVED_FILEFIELD, instance.image)
        instance.image = None


@receiver(post_save, sender=Recipe)
def save_file(sender, instance, created, **kwargs):
    if created and hasattr(instance, _UNSAVED_FILEFIELD):
        instance.image = getattr(instance, _UNSAVED_FILEFIELD)
        
    if created:
        # create recipe nutrition after save
        RecipeNutrition.objects.create(recipe=instance)
        


@receiver(post_save, sender=RecipeIngredients)
def save_nutrition(sender, instance, created, **kwargs):
    sortlist = Recipe._meta.fields
    nutrient_field = []
    
    for i in sortlist:
        if str(type(i)) == "<class 'django.db.models.fields.DecimalField'>":
                nutrient_field.append(i)

    sortlist = RecipeNutrition._meta.fields

    for i in sortlist:
        if str(type(i)) == "<class 'django.db.models.fields.DecimalField'>":
                nutrient_field.append(i)

    recipe = instance.recipe
    recipenutri = instance.recipe.recipeNutritionInfo
    recipeings = instance.recipe.recipeIngredients.all()

    for i in nutrient_field:
        if hasattr(recipenutri, i.name):
            setattr(recipenutri, i.name, 0.000)
        elif hasattr(recipe, i.name):
            setattr(recipe, i.name, 0.000)

    recipenutri.save()
    recipe.save()

    for j in recipeings:
        additionalinginfo = AddtnlIngredientInfo.objects.get(
            ingredient=j.ingredient)
        for i in nutrient_field:
            if hasattr(j.ingredient, i.name) and getattr(j.ingredient,
                                                         i.name) is not None:
                old = getattr(recipe, i.name)
                setattr(recipe, i.name,
                        decimal.Decimal(old) +
                        decimal.Decimal(j.quantity) *
                        decimal.Decimal(getattr(j.ingredient, i.name))
                        * decimal.Decimal(j.measure.weight /
                                          (100 * recipe.servings * 
                                          decimal.Decimal(j.measure.amount))))
            elif hasattr(additionalinginfo, i.name) and \
                    getattr(additionalinginfo, i.name) is not None:
                old = getattr(recipenutri, i.name)
                setattr(recipenutri, i.name,
                        decimal.Decimal(old) +
                        decimal.Decimal(instance.quantity) *
                        decimal.Decimal(getattr(additionalinginfo, i.name))
                        * decimal.Decimal(j.measure.weight /
                                          (100 * recipe.servings * 
                                          decimal.Decimal(j.measure.amount))))

        recipenutri.save()
        recipe.save()


@receiver(pre_delete, sender=RecipeIngredients)
def delete_nutrition(sender, instance, **kwargs):

    sortlist = Recipe._meta.fields
    nutrient_field = []

    for i in sortlist:
        if str(type(i)) == "<class 'django.db.models.fields.DecimalField'>":
                nutrient_field.append(i)

    sortlist = RecipeNutrition._meta.fields
    for i in sortlist:
        if str(type(i)) == "<class 'django.db.models.fields.DecimalField'>":
                nutrient_field.append(i)
    sortlist = None
    ingredient = instance.ingredient
    recipe = instance.recipe
    additionalinginfo = AddtnlIngredientInfo.objects.get(ingredient=ingredient)
    recipenutri = instance.recipe.recipeNutritionInfo

    for i in nutrient_field:
        if hasattr(ingredient, i.name) and\
                getattr(ingredient, i.name) is not None:
            old = getattr(recipe, i.name)

            if old > 0.000:
                setattr(recipe, i.name,
                        decimal.Decimal(old) -
                        instance.quantity * getattr(ingredient, i.name)
                        * decimal.Decimal(instance.measure.weight /
                                          (100 * recipe.servings *
                                          decimal.Decimal(instance.measure.amount))))
        elif hasattr(additionalinginfo, i.name) and\
                getattr(additionalinginfo, i.name) is not None:
            old = getattr(recipenutri, i.name)
            if old > 0.000:
                setattr(recipenutri, i.name,
                        decimal.Decimal(old) -
                        decimal.Decimal(instance.quantity)
                        * decimal.Decimal(getattr(additionalinginfo, i.name))
                        * decimal.Decimal(instance.measure.weight /
                                          (100 * recipe.servings * 
                                          decimal.Decimal(instance.measure.amount))))
        recipenutri.save()
        recipe.save()
