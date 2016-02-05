'''Serializers convert the db queries into python 
data structures(dictionaries) for easy json rendering'''
from rest_framework import serializers
from bitespace_app.models import USDAIngredient

class GlobalSearchSerializer(serializers.ModelSerializer):
	class Meta:
		model = USDAIngredient
