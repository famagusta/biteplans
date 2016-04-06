'''Serializers convert the db queries into python
data structures(dictionaries) for easy json rendering'''
from rest_framework import serializers
from ingredients.models import USDAIngredient, USDAIngredientCommonMeasures
from recipes.models import Recipe, RecipeIngredients
from authentication.models import Account

class IngredientSerializer(serializers.ModelSerializer):
    '''serializes python object into JSON serializable syntax'''
    class Meta:
        '''defines the model to be serialized'''
        model = USDAIngredient



class IngredientMeasureSerializer(serializers.ModelSerializer):
    '''serializes a python object into JSON serializabale format'''
    class Meta:
        '''defines the model to be serialized'''
        model = USDAIngredientCommonMeasures


