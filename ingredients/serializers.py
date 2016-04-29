'''Serializers convert the db queries into python
data structures(dictionaries) for easy json rendering'''
from rest_framework import serializers
from ingredients.models import Ingredient, IngredientCommonMeasures, AddtnlIngredientInfo
from recipes.models import Recipe, RecipeIngredients
from authentication.models import Account

class IngredientMeasureSerializer(serializers.ModelSerializer):
    '''serializes a python object into JSON serializabale format'''
    class Meta:
        '''defines the model to be serialized'''
        model = IngredientCommonMeasures

class IngredientSerializer(serializers.ModelSerializer):
    '''serializes python object into JSON serializable syntax'''
    measure = IngredientMeasureSerializer(many=True, read_only=True)
    class Meta:
        '''defines the model to be serialized'''
        model = Ingredient

class AddtnlInfoIngSerializer(serializers.ModelSerializer):
	'''serializes additional info of ingredients'''
	class Meta:
		'''defines model to be assosiated'''
		model = AddtnlIngredientInfo