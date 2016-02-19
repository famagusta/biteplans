'''This Script populates the Database with recipes
from open source recipe indexing project
https://github.com/fictivekin/openrecipes
The datadump from the above link is broken into different
json files for easy parsing and identifying potential differences
in formats. A few errors were encountered and inconsistencies were
manually fixed in the data file itself.'''

import os
import json

# you need this line to tell python that we are in django
# project bitespace
os.environ.setdefault("DJANGO_SETTINGS_MODULE",
                      "bitespace_project_config.settings")

from bitespace_app.models import Recipe

SOURCE_NAMES_FILE = open('data/source_recipes.txt', 'r')
DATA_SOURCES = SOURCE_NAMES_FILE.readlines()
SOURCE_NAMES_FILE.close()

for datasource in DATA_SOURCES:
    # Remove any trailing whitespaces
    datasource = datasource.strip()

    # Print progress
    print "Processing : " + datasource

    json_filename = 'data/' + datasource + '_data.json'
    with open(json_filename, 'r') as json_source:
        source_data = json.load(json_source)

    for source in source_data:
        recipe_id = source['_id']['$oid']       # Extract id

        if 'description' in source:
            description = source['description']  # Extract description
        else:
            description = None

        ingredients = source['ingredients']     # Extract ingredients
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
        else:
            recipe_yield = None

        if 'datePublished' in source:
            # Not really useful but what the hell
            date_published = source['datePublished']
        else:
            date_published = None

        # create a recipe object
        recipe = Recipe(recipe_id, description=description,
                        ingredients=ingredients, name=name, url=url,
                        prep_time=prep_time, cook_time=cook_time,
                        source=source['source'], image=image,
                        recipe_yield=recipe_yield,
                        date_published=date_published)

        # save into database
        recipe.save()
    json_source.close()
