'''script to populate some test recipes'''

import os
import codecs
# you need this line to tell python that we are in django
# project bitespace
os.environ.setdefault("DJANGO_SETTINGS_MODULE",
                      "biteplans_project_config.settings")

import json
import re
from imported_recipes.models import ImportedRecipe

from datetime import timedelta, datetime
import tablib
from import_export import resources
import csv
from decimal import *
from recipes.models import Recipe, RecipeIngredients
from ingredients.models import Ingredient, IngredientCommonMeasures
from authentication.models import Account

'''
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


chapati = Recipe(name="chapati, roti, indian bread, tawa roti, chapathi, phulka",
                 description="a common bread served with indian dishes", 
                 directions="In a medium bowl, stir together the flour, salt, water and oil, until the mixture pulls away from the sides. Turn the dough out onto a well floured surface. Knead until smooth and pliable, about 10 minutes.\n Preheat an unoiled skillet or tava to medium high heat. Divide dough into 12 equal parts, form into rounds and cover with a damp cloth. Flatten the balls with the palm of your hand, then use a rolling pin to roll out each piece into a 6 to 8 inch diameter round.\n Cook the roti for 1 minute before turning over, then turn again after another minute. The roti should have some darker brown spots when finished. Best served warm.",
                prep_time=timedelta(hours=0, minutes=15, seconds=0),
                cook_time=timedelta(hours=0, minutes=30, seconds=0),
                servings=10,
                created_by=Account.objects.get(pk=1)
                )

chapati.save()

roti_ingredient_1 = RecipeIngredients(recipe=chapati,
                                   ingredient=Ingredient.objects.get(pk=20080),
                                   measure=IngredientCommonMeasures.objects.get(pk=12235), 
                                   quantity=2)
roti_ingredient_2 = RecipeIngredients(recipe=chapati,
                                   ingredient=Ingredient.objects.get(pk=2047),
                                   measure=IngredientCommonMeasures.objects.get(pk=687), 
                                   quantity=0.5)
roti_ingredient_3 = RecipeIngredients(recipe=chapati,
                                   ingredient=Ingredient.objects.get(pk=14555),
                                   measure=IngredientCommonMeasures.objects.get(pk=8329), 
                                   quantity=0.75)
roti_ingredient_4 = RecipeIngredients(recipe=chapati,
                                   ingredient=Ingredient.objects.get(pk=4513),
                                   measure=IngredientCommonMeasures.objects.get(pk=1638), 
                                   quantity=1)


roti_ingredient_1.save()
roti_ingredient_2.save()
roti_ingredient_3.save()
roti_ingredient_4.save()
'''



SOURCE_NAMES_FILE = open('data/source_recipes.txt', 'r')
DATA_SOURCES = SOURCE_NAMES_FILE.readlines()
SOURCE_NAMES_FILE.close()

time_pattern = r"^PT(\d*)H(\d*)M"
yield_pattern_1 = r"^serve(s)? (\d+)"
yield_pattern_2 = r"(\d+) Serving(s)?"

for datasource in DATA_SOURCES:
    # Remove any trailing whitespaces
    datasource = datasource.strip()

    # Print progress
    print "Processing : " + datasource

    json_filename = 'data/recipes_sourcewise/' + datasource + '_data.json'
    with open(json_filename, 'r') as json_source:
        source_data = json.load(json_source)

    for source in source_data:
        recipe_id = source['_id']['$oid']       # Extract id

        if 'description' in source:
            description = source['description']  # Extract description
        else:
            description = None

        #ingredients = source['ingredients']     # Extract ingredients
        name = source['name']                   # Extract name
        url = source['url']                     # Extract url

        if 'prepTime' in source:                # Extract prep time
            prep_time = source['prepTime']
        elif 'totalTime' in source:
            # Some sources only give total time - add it to prep
            # time instead
            prep_time = source['totalTime']
        else:
            prep_time = None

        if 'cookTime' in source:                # Extract cook time
            cook_time = source['cookTime']
        else:
            cook_time = None
        data_source = source['source']          # Where does the data come from

        if 'image' in source:                   # image source (url)
            # some entries had img file code - i deleted them
            # only 3-4 such entries
            image = source['image']
        else:
            image = None

        if 'recipeYield' in source:
            # Extract yield. we will use this later
            recipe_yield = source['recipeYield']
            if recipe_yield is not None:
                recipe_yield = recipe_yield[0:190]
        else:
            recipe_yield = None

        if 'datePublished' in source:
            # Not really useful but what the hell
            date_published = source['datePublished']
        else:
            date_published = None

        # create a recipe object
        if recipe_yield is not None and prep_time is not None\
            and date_published is not None and cook_time is not None:
            
            prep_time_groups = re.match(time_pattern, prep_time)
            cook_time_groups = re.match(time_pattern, prep_time)
            
            prep_time_h = 0
            prep_time_m = 0
            
            cook_time_h = 0
            cook_time_m = 0
            try:
                prep_time_h = int(prep_time_groups.group(1))
                prep_time_m = int(prep_time_groups.group(2))
            
                cook_time_h = int(prep_time_groups.group(1))
                cook_time_m = int(prep_time_groups.group(2))
            except:
                continue
            '''
            print "Prep Time Hours : " + str(prep_time_h)
            print "Prep Time Mins : " + str(prep_time_m)
            
            print recipe_yield
            print date_published
            print datetime.strptime(date_published, "%Y-%m-%d")
            print timedelta(hours=prep_time_h, minutes=prep_time_m, seconds=0),
            '''
            ryield=0
            try:
                ryield = int(recipe_yield)
            except ValueError:
                try:
                    ryield = re.match(yield_pattern_1, recipe_yield).group(2)
                except:
                    try:
                        ryield = re.match(yield_pattern_2, recipe_yield).group(1)
                    except:
                        continue
            publication_date = None
            try:
                publication_date = datetime.strptime(date_published, "%Y-%m-%d")
            except:
                continue
                
            if publication_date is not None:
                try:
                    recipe = Recipe(description=description, directions="",
                                    name=name, url=url,
                                    prep_time=timedelta(hours=prep_time_h, minutes=prep_time_m, seconds=0),
                                    cook_time=timedelta(hours=cook_time_h, minutes=cook_time_m, seconds=0),
                                    source=source['source'],
                                    image=image, servings=ryield,
                                    date_published=publication_date,
                                    created_by=Account.objects.get(pk=1))
            
                    print "Success"
                                # save into database
                    recipe.save()
                    print "Success"
                except:
                    print "unsucceful"
                    print description
                    print name
                    print url
                    print timedelta(hours=prep_time_h, minutes=prep_time_m, seconds=0)
                    print timedelta(hours=cook_time_h, minutes=cook_time_m, seconds=0)
                    print source['source']
                    print image
                    print ryield
                    print publication_date
                    continue
    json_source.close()
