'''models for imported ingredients from open source
   recipe bookmark project'''
from django.db import models


class ImportedRecipe(models.Model):
    '''Model to represent recipes extracted from the web
       https://github.com/fictivekin/openrecipes'''
    recipe_id = models.CharField(primary_key=True, max_length=191)
    description = models.TextField(null=True)
    ingredients = models.TextField()
    name = models.TextField()
    url = models.URLField(max_length=400)
    prep_time = models.CharField(null=True, max_length=191)
    cook_time = models.CharField(null=True, max_length=191)
    source = models.CharField(max_length=191)
    image = models.URLField(null=True, max_length=400)
    recipe_yield = models.CharField(null=True, max_length=191)
    date_published = models.CharField(null=True, max_length=191)

    def __unicode__(self):
        return self.name

    class Meta:
        '''name db table'''
        db_table = 'imported_recipes_importedrecipe'


class ImportedRecipeIngredients(models.Model):
    '''Model to represent all ingredients extracted from the
       recipes'''
    recipe_id = models.ForeignKey(ImportedRecipe, on_delete=models.CASCADE)
    ingredient_tags = models.CharField(null=True, blank=True, max_length=1000)
    class Meta:
        '''name db table'''
        db_table = 'imported_recipes_importedrecipeingredients'


class ImportedIngredientQuantity(models.Model):
    '''Model to represent various quantities of an ingredient
    in a recipe'''
    recipe_ingred_id = models.ForeignKey(ImportedRecipeIngredients,
                                         on_delete=models.CASCADE)
    ingredient_quantity = models.DecimalField(max_digits=11,
                                              decimal_places=3,
                                              null=True)
    ingredient_measure = models.CharField(null=True, blank=True,
                                          max_length=191)
    class Meta:
        '''name db table'''
        db_table = 'imported_recipes_importedingredientquantity'
