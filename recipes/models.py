from django.db import models
from ingredients.models import USDAIngredient,\
    IndianIngredient, USDAIngredientCommonMeasures
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
    directions = models.TextField()
    prep_time = models.DateTimeField(null=True, blank=True)
    cook_time = models.DateTimeField(null=True, blank=True)
    servings = models.IntegerField()
    # TODO: Handle case of saving recipe when user is deleted
    created_by = models.ForeignKey(Account, on_delete=models.CASCADE,
                                   related_name="created_recipe")
    date_published = models.DateField()
    image = models.URLField(null=True, max_length=400)

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
    ingredient = models.ForeignKey(USDAIngredient, on_delete=models.CASCADE,
                                   related_name="ingredient_of_recipe")
    # units & quantity must not be empty ever
    # units could be a model of its own to make things standardized across apps
    measure = models.ForeignKey(USDAIngredientCommonMeasures,
                                related_name="measure_of_recipeingredient")
    quantity = models.IntegerField()
    # modifiers - optional description for the ingredients
    modifiers = models.CharField(null=True, blank=True, max_length=191)

    def __unicode__(self):
      return self.modifiers

