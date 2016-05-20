'''Serializers convert the db queries into python
data structures(dictionaries) for easy json rendering'''
from rest_framework import serializers
from dietplans.models import DietPlan, DayPlan, MealPlan, MealRecipe,\
    MealIngredient
from recipes.serializers import RecipeSerializer

from ingredients.serializers import IngredientSerializer, \
IngredientMeasureSerializer

class DietPlanSerializer(serializers.ModelSerializer):
    '''Serializer to convert the recieved data into suitable python dict'''

    class Meta:
        '''Meta data, or config for the serializer'''
        model = DietPlan
        read_only_fields = ('id', 'creator', )


class MealRecipeSerializer(serializers.ModelSerializer):
    '''Serializer to convert the recieved data into suitable python dict'''
    recipe = RecipeSerializer(many=False, read_only=True)
    class Meta:
        '''Meta data, or config for the serializer'''
        model = MealRecipe

class MealRecpSerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	class Meta:
		'''Meta data, or config for the serializer'''
		model = MealRecipe


class MealIngredientSerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''

	unit = IngredientMeasureSerializer(many=False, read_only=True)
	ingredient = IngredientSerializer(many=False, read_only=True)
	class Meta:
		'''Meta data, or config for the serializer'''
		model = MealIngredient


class MealIngSerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	class Meta:
		'''Meta data, or config for the serializer'''
		model = MealIngredient

class MealPlanSerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	class Meta:
		'''Meta data, or config for the serializer'''
		model = MealPlan

class MealPlnSerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	mealrecipe = MealRecipeSerializer(many=True, read_only=True)
	mealingredient = MealIngredientSerializer(many=True, read_only=True)
	class Meta:
		'''Meta data, or config for the serializer'''
		model = MealPlan


class DayPlanSerializer(serializers.ModelSerializer):
    '''Serializer to convert the recieved data into suitable python dict'''
    mealplan = MealPlnSerializer(many=True, read_only=True)

    class Meta:
        '''Meta data, or config for the serializer'''
        model = DayPlan

class CopySerializer(serializers.Serializer):
    '''Serializer to convert the recieved data into suitable python dict'''
    from_day = serializers.IntegerField(min_value=1, max_value=7)
    from_week = serializers.IntegerField(min_value=1)
    to_day = serializers.IntegerField(min_value=1, max_value=7)
    to_week = serializers.IntegerField(min_value=1)
    dietplan = serializers.IntegerField(min_value=0)
