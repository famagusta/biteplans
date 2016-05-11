'''Serializers convert the db queries into python
data structures(dictionaries) for easy json rendering'''
from rest_framework import serializers
from dietplans.models import DietPlan, DayPlan, MealPlan, MealRecipe,\
    MealIngredient
from recipes.serializers import RecipeSerializer
from plan_calendar.models import UserPlanHistory, MealHistory, \
EventIngredient, EventRecipe

from ingredients.serializers import IngredientSerializer, \
IngredientMeasureSerializer
from dietplans.serializers import DietPlanSerializer

class UserPlanHistorySerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	dietplan = DietPlanSerializer(many=False, read_only=True)
	class Meta:
		'''Meta data, or config for the serializer'''
		model = UserPlanHistory
		read_only_fields = ('id', 'created_on', 'updated_on', 'user', )

class UserPlnHistorySerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	class Meta:
		'''Meta data, or config for the serializer'''
		model = UserPlanHistory
		read_only_fields = ('id', 'created_on', 'updated_on', 'user', )

class EventRecipeSerializer(serializers.ModelSerializer):
    '''Serializer to convert the recieved data into suitable python dict'''
    meal_recipe = RecipeSerializer(many=False, read_only=True)
    class Meta:
        '''Meta data, or config for the serializer'''
        model = EventRecipe

class EventRecpSerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	class Meta:
		'''Meta data, or config for the serializer'''
		model = EventRecipe


class EventIngredientSerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''

	unit_desc = IngredientMeasureSerializer(many=False, read_only=True)
	meal_ingredient = IngredientSerializer(many=False, read_only=True)
	class Meta:
		'''Meta data, or config for the serializer'''
		model = EventIngredient


class EventIngSerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	class Meta:
		'''Meta data, or config for the serializer'''
		model = EventIngredient


class MealHistorySerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	followingMealPlanRecipe = EventRecipeSerializer(many=True, read_only=True)
	followingMealPlanIngredient = EventIngredientSerializer(many=True,
	                                                        read_only=True)
	class Meta:
		'''Meta data, or config for the serializer'''
		model = MealHistory
		read_only_fields = ('id', 'updated_on', 'date', 'time', )

class MealHistoryWriteSerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	class Meta:
		'''Meta data, or config for the serializer'''
		model = MealHistory
		read_only_fields = ('id', 'updated_on', 'date', 'time', )

