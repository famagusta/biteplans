'''Serializers convert the db queries into python 
data structures(dictionaries) for easy json rendering'''
from rest_framework import serializers
from bitespace_app.models import USDAIngredient
from bitespace_app.models import Recipe
from authentication.models import Account

class GlobalSearchSerializer(serializers.ModelSerializer):
    '''serializes a python object into JSON serializabale format'''
    class Meta:
        '''defines the model to be serialized'''
        model = USDAIngredient

class RecipeSearchSerializer(serializers.ModelSerializer):
    '''serializes a python object into JSON serializabale format'''
    class Meta:
        '''defines the model to be serialized'''
        model = Recipe
        
class AccountSerializer(serializers.ModelSerializer):
    '''serializes a python object into JSON serializabale format'''
    class Meta:
        '''defines the model to be serialized'''
        model = Account
