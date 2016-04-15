import os
import json

# you need this line to tell python that we are in django
# project bitespace
os.environ.setdefault("DJANGO_SETTINGS_MODULE",
                      "bitespace_project_config.settings")

from bitespace_app.models import USDAIngredient, Recipe,\
    RecipeIngredients, IngredientQuantity
import django
django.setup()

from django.db.models import Q


recipeingredients = RecipeIngredients.objects.all()
usdaingredients = USDAIngredient.objects.all()

for ind, ringred in enumerate(recipeingredients):
    if ind < 10:
        words = ringred.ingredient_tags.split(' ')
        query_filters = Q(lng_desc__icontains='')
        print words
        for word in words:
            query_filters = query_filters & Q(lng_desc__icontains=word)
        result = usdaingredients.filter(query_filters)
        print result
    else:
        break
