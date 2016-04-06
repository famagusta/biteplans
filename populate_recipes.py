'''script to populate some test recipes'''

import os
import codecs
# you need this line to tell python that we are in django
# project bitespace
os.environ.setdefault("DJANGO_SETTINGS_MODULE",
                      "biteplans_project_config.settings")

import tablib
from import_export import resources
import csv
from decimal import *
from recipes.models import Recipe, RecipeIngredients
from ingredients.models import Ingredient, IngredientCommonMeasures
from authentication.models import Account


scrambled_eggs = Recipe(name='Scrambled Eggs',
                        description= 'A quick an easy recipes for making scrambled eggs',
                        directions= 'Heat the oil in a skillet on medium heat for 2 mins, add two eggs with salt and pepper. Scramble for 5 mins',
                        servings=1,
                        created_by=Account.objects.get(pk=1))

scrambled_eggs.save()

se_ingredient_1 = RecipeIngredients(recipe=scrambled_eggs,
                                   ingredient=Ingredient.objects.get(pk=1123),
                                   measure=IngredientCommonMeasures.objects.get(pk=346), 
                                   quantity=2)
se_ingredient_2 = RecipeIngredients(recipe=scrambled_eggs,
                                   ingredient=Ingredient.objects.get(pk=2047),
                                   measure=IngredientCommonMeasures.objects.get(pk=690), 
                                   quantity=2)
se_ingredient_3 = RecipeIngredients(recipe=scrambled_eggs,
                                   ingredient=Ingredient.objects.get(pk=2030),
                                   measure=IngredientCommonMeasures.objects.get(pk=651), 
                                   quantity=2)

se_ingredient_1.save()
se_ingredient_2.save()
se_ingredient_3.save()