'''Serializers convert the db queries into python
data structures(dictionaries) for easy json rendering'''
from rest_framework import serializers
from ingredients.models import Ingredient, IngredientCommonMeasures
from ingredients.serializers import IngredientSerializer,\
    IngredientMeasureSerializer
from recipes.models import Recipe, RecipeIngredients, RecipeNutrition
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
#        fields = ('id', 'name', 'description', 'directions', 'prep_time',
#            'cook_time', 'servings', 'source', 'url', 'created_by',
#            'image', 'recipeIngredients')
        read_only_fields = ('date_published', 'created_by', 'carbohydrate_tot',\
                            'water', 'fat_tot', 'fiber_tot', 'protein_tot', \
                            'energy_kal', 'sugar_tot', )


class RecipeReadSerializer(serializers.ModelSerializer):
    '''serializes a python object into JSON serializabale format'''
    class Meta:
        '''defines the model to be serialized'''
        model = Recipe
#        fields = ('id', 'name', 'description', 'directions', 'prep_time',
#            'cook_time', 'servings', 'source', 'url', 'created_by',
#            'image', 'recipeIngredients')
        read_only_fields = ('date_published', 'created_by', 'carbohydrate_tot',\
                            'water', 'fat_tot', 'fiber_tot', 'protein_tot', \
                            'energy_kal', 'sugar_tot', )

    
class RecipeNutritionSerializer(serializers.ModelSerializer):
    '''serializer recipe nutrition object into json format'''
    class Meta:
        '''defines model to be assosiated'''
        model = RecipeNutrition
