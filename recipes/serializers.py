'''Serializers convert the db queries into python
data structures(dictionaries) for easy json rendering'''
from rest_framework import serializers
from ingredients.models import Ingredient, IngredientCommonMeasures
from ingredients.serializers import IngredientSerializer,\
    IngredientMeasureSerializer
from recipes.models import Recipe, RecipeIngredients
from authentication.models import Account
from dietplans.models import DietPlan



class RecipeIngredientsSerializer(serializers.ModelSerializer):
    '''serializes a python object into JSON serializabale format'''
    ingredient = IngredientSerializer(many=False, read_only=True)
    measure = IngredientMeasureSerializer(many=False, read_only=True)

    class Meta:
        '''defines the model to be serialized'''
        model = RecipeIngredients


class RecipeIngSerializer(serializers.ModelSerializer):
    '''serializes a python object into JSON serializabale format'''

    class Meta:
        '''defines the model to be serialized'''
        model = RecipeIngredients


class RecipeSerializer(serializers.ModelSerializer):
    '''serializes a python object into JSON serializabale format'''
    recipeIngredients = RecipeIngredientsSerializer(read_only=True, many=True)

    class Meta:
        '''defines the model to be serialized'''
        model = Recipe
