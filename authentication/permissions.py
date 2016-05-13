from rest_framework import permissions
from dietplans.models import DayPlan, MealPlan
from recipes.models import Recipe

##has_permissions is for general permissions for querysets

##has_object_permissions manages object level permissions for various
##models, for eg. object level permissions include deleting, updating
##or retrieving a particular instance.

class IsAccountOwner(permissions.BasePermission):
	'''check if the user is owner of the account requested'''
	def has_object_permission(self, request, view, account):
		if request.user:
		    return account == request.user
		return False


class IsPlanOwner(permissions.BasePermission):
	'''check if user is creator of plan requested or being modified'''
	def has_object_permission(self, request, view, plan):
		if request.user:
		    return plan.creator == request.user
		return False

class IsRecipeOwner(permissions.BasePermission):
	'''check if user is creator of recipe requested or being modified'''
	def has_object_permission(self, request, view, plan):
		if request.user:
			return plan.created_by == request.user
		return False

class IsFollowing(permissions.BasePermission):
	'''check if user is following plan being accessed'''
	def has_object_permission(self, request, view, plan):
		if request.user:
			return plan.user == request.user
		return False

class IsEventMealHistoryOwner(permissions.BasePermission):
	'''check if user is following plan assosiated with event ingredient/recipe
	being accessed'''
	def has_object_permission(self, request, view, eventIngredientOrRecipe):
		if request.user:
			return eventIngredientOrRecipe.meal_history.user == request.user
		return False

class IsRecipeIngOwner(permissions.BasePermission):
	'''check if user is creator of recipe requested
	or being modified from the
	level of recipe ingredients, this is checked
	when meal plan are being accessed'''
	def has_permission(self, request, view):
		'''handles permission for getting/creating'''
		if request.method == "POST" and request.user.is_authenticated():
			recipe = request.POST.get('recipe', False)
			if recipe == False:
				return False
			recp = Recipe.objects.get(pk=recipe)
			return recp.created_by == request.user

		return False


class IsRecipeIngrOwner(permissions.BasePermission):
	'''check if user is creator of recipe requested
	or being modified from the
	level of recipe ingredients, this is checked
	when meal plan are being accessed'''
	def has_object_permission(self, request, view, ing):
		'''handles permissions for editing the object'''
		if request.user:
			creator = (ing).recipe.created_by
			return creator == request.user
		return False



class IsDayMealOwner(permissions.BasePermission):
	'''check if user is creator of plan requested
	or being modified from the
	level of meal plans, this is checked
	when meal plan are being accessed'''
	def has_permission(self, request, view):
		'''handles permission for getting/creating'''
		if request.user.is_authenticated():
			dayid = request.POST.get('day', False)
			if dayid == False:
				return False
			day = DayPlan.objects.get(pk=request.data['day'])
			return day.diet.creator == request.user
		return False

class IsDayMealrOwner(permissions.BasePermission):
	'''check if user is creator of plan requested
	or being modified from the
	level of meal plans, this is checked
	when meal plan are being accessed'''
	def has_object_permission(self, request, view, meal):
		'''handles permissions for editing the object'''
		if request.user:
			creator = (meal.day).diet.creator
			return creator == request.user
		return False


class IsMealOwner(permissions.BasePermission):
	'''check if user is creator of plan requested
	or being modified from the
	level of meal plans, this is checked
	when meal plan are being accessed'''
	def has_permission(self, request, view):
		'''handles permission for getting/creating'''
		if request.method == "POST" and request.user.is_authenticated():
			meal = MealPlan.objects.get(pk=request.data['meal_plan'])
			return meal.day.diet.creator == request.user

		return False


class IsMealingOwner(permissions.BasePermission):
	'''check if user is creator of plan requested
	or being modified from the
	level of meal ingredients, this is checked
	when meal ingredients are being accessed'''
	def has_object_permission(self, request, view, mealIng):
		'''handles permissions for editing the object'''
		if request.user:
			creator = (mealIng.meal_plan.day).diet.creator
			return creator == request.user
		return False

