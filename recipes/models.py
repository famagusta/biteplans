from django.db import models
from datetime import datetime
from ingredients.models import Ingredient,\
    IngredientCommonMeasures
from authentication.models import Account
# Create your models here.


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
    image = models.URLField(null=True, blank=True, max_length=400)

    def __unicode__(self):
        return self.name


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
    measure = models.ForeignKey(IngredientCommonMeasures, null=True, blank=True,
                                related_name="measure_of_recipeingredient")
    quantity = models.DecimalField(max_digits=11, decimal_places=3)
    # modifiers - optional description for the ingredients
    modifiers = models.CharField(null=True, blank=True, max_length=191)

    def __unicode__(self):
        return self.ingredient.name
    
    
    def possible_measures(self):
        '''return set of measures possible for current ingredient'''
        measure_set = IngredientCommonMeasures.objects.filter(ingred_id=self.ingredient)
        return measure_set
