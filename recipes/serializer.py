'''This file defines serailzers for the Biteplan Recipes
   Serializers convert the db queries into python
   data structures(dictionaries) for easy json rendering'''
from rest_framework import serializers
from bitespace_app.models import USDAIngredient
from bitespace_app.models import Recipe
from authentication.models import Account
from dietplans.models import DietPlan
from dietplans.serializers import DietPlanSerializer

