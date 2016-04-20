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
   
    age = serializers.DecimalField(read_only=False, required=False,
                      allow_null=True, allow_blank=True)
    gender = serializers.CharField(read_only=False, required=False,
                      allow_null=True, allow_blank=True)
    height = serializers.DecimalField(read_only=False, required=False,
                      allow_null=True, allow_blank=True)
    weight = serializers.DecimalField(read_only=False, required=False,
                      allow_null=True, allow_blank=True)
    goal = serializers.CharField(read_only=False, required=False,
                      allow_null=True, allow_blank=True)
    description = serializers.TextField(read_only=False, required=False,
                      allow_null=True, allow_blank=True)

    class Meta:
        '''Meta data, or config for the serializer'''
        model = DietPlan


class MealRecipeSerializer(serializers.ModelSerializer):
    '''Serializer to convert the recieved data into suitable python dict'''
    reciple = RecipeSerializer(many=False, read_only=True)
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
	mealrecipe = MealRecipeSerializer(many=True, read_only=True)
	meal_ingredient = MealIngSerializer(many=True, read_only=True)
	class Meta:
		'''Meta data, or config for the serializer'''
		model = MealPlan

class MealPlnSerializer(serializers.ModelSerializer):
	'''Serializer to convert the recieved data into suitable python dict'''
	mealrecipe = MealRecpSerializer(many=True, read_only=True)
	meal_ingredient = MealIngSerializer(many=True, read_only=True)
	class Meta:
		'''Meta data, or config for the serializer'''
		model = MealPlan


class DayPlanSerializer(serializers.ModelSerializer):
    '''Serializer to convert the recieved data into suitable python dict'''
    mealplan = MealPlnSerializer(many=True, read_only=True)

    class Meta:
        '''Meta data, or config for the serializer'''
        model = DayPlan
