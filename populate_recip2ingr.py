''' This script populates the database with ingredients extracted from recipes
    from the open source recipe indexing project'''

import os
import json


# you need this line to tell python that we are in django
# project bitespace
os.environ.setdefault("DJANGO_SETTINGS_MODULE",
                      "bitespace_project_config.settings")

from bitespace_app.models import Recipe, RecipeIngredients, IngredientQuantity

SOURCE_NAMES_FILE = open('data/source_recipes.txt', 'r')
DATA_SOURCES = SOURCE_NAMES_FILE.readlines()
SOURCE_NAMES_FILE.close()

for datasource in DATA_SOURCES:
    '''Process all data source files for recipes from different source'''
    # Remove any trailing whitespaces
    datasource = datasource.strip()

    # Print progress
    print "Processing : " + datasource

    json_filename = 'data/extracted_ingredients/' + datasource\
        + '_ingreds.json'
    with open(json_filename, 'r') as json_source:
        source_data = json.load(json_source)

    recipes = Recipe.objects.all()

    source_recipes = recipes.filter(source=datasource)

    no_recipes_source = len(source_recipes)

    for i in range(0, no_recipes_source):
        '''iterate over all recipes from this source with
           ingredients extracted'''
        # get recipes from this data source

        # extract recipe_id
        recipe_id = source_recipes[i].recipe_id
        try:
            recipe_ingredients = source_data[recipe_id]

            no_ingredients = len(recipe_ingredients)

            for j in range(0, no_ingredients):
                curr_ingredient = recipe_ingredients[str(j)]
                recipe_ingredient = " ".join(
                                    curr_ingredient['ingredient_tags'])
                # print "Creating New RecipeIngredients object . . . "
                # create new RecipeIngredients object to save later on
                new_ingredient = RecipeIngredients(ingredient_tags=recipe_ingredient)
                new_ingredient.recipe_id = source_recipes[i]
                new_ingredient.save()
                # TODO: save the new_ingredient variable
                qm_tuples = curr_ingredient['qm_pairs']
                no_qm_tuples = len(qm_tuples)
                # print(qm_tuples)
                for k in range(0, no_qm_tuples):
                    # create new IngredientQuantity object
                    # to stuff into the database
                    # print "Creating New IngredientQuantity Object . . ."
                    new_ingred_quant = IngredientQuantity(ingredient_quanty=qm_tuples[str(k)]['q'],
                                                          ingredient_measure=qm_tuples[str(k)]['m'])
                    # print new_ingredient
                    new_ingred_quant.recipe_ingred_id = new_ingredient
                    new_ingred_quant.save()
        except KeyError:
            print "key : " + recipe_id + " in source : " + datasource + " not found"
