'''Serializers convert the db queries into python
data structures(dictionaries) for easy json rendering'''
from rest_framework import serializers
from dietplans.models import DietPlan, DayPlan, MealPlan, MealRecipe, MealIngredient
from recipes.serializers import RecipeSerializer
from ingredients.serializers import IngredientSerializer
class DietPlanSerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	class Meta:
		'''Meta data, or config for the serializer'''
		model = DietPlan

class MealRecipeSerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	reciple = RecipeSerializer(many=False, read_only=True)
	class Meta:
		'''Meta data, or config for the serializer'''
		model = MealRecipe

class MealIngredientSerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	ingredient = IngredientSerializer(many=False, read_only=True)
	measure = IngredientSerializer(many=False, read_only=True)
	class Meta:
		'''Meta data, or config for the serializer'''
		model = MealIngredient

class MealPlanSerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	mealrecipe = MealRecipeSerializer(many=True, read_only=True)
	class Meta:
		'''Meta data, or config for the serializer'''
		model = MealPlan

class DayPlanSerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	mealplan = MealPlanSerializer(many=True, read_only=True)
	class Meta:
		'''Meta data, or config for the serializer'''
		model = DayPlan






