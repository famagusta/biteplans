from rest_framework import permissions
from dietplans.models import DayPlan, MealPlan
from recipes.models import Recipe


class IsAccountOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, account):
        if request.user:
            return account == request.user
        return False


class IsPlanOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, plan):
        if request.user:
            return plan.creator == request.user
        return False

class IsRecipeOwner(permissions.BasePermission):
	def has_object_permission(self, request, view, plan):
		if request.user:
			return plan.created_by == request.user
		return False

class IsFollowing(permissions.BasePermission):
	def has_object_permission(self, request, view, plan):
		if request.user:
			return plan.user == request.user
		return False

class IsRecipeIngOwner(permissions.BasePermission):
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
	def has_object_permission(self, request, view, ing):
		'''handles permissions for editing the object'''
		if request.user:
			creator = (ing).recipe.created_by
			return creator == request.user
		return False



class IsDayMealOwner(permissions.BasePermission):
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
	def has_object_permission(self, request, view, meal):
		'''handles permissions for editing the object'''
		if request.user:
			creator = (meal.day).diet.creator
			return creator == request.user
		return False


class IsMealOwner(permissions.BasePermission):
	def has_permission(self, request, view):
		'''handles permission for getting/creating'''
		if request.method == "POST" and request.user.is_authenticated():
			meal = MealPlan.objects.get(pk=request.data['meal_plan'])
			return meal.day.diet.creator == request.user

		return False


class IsMealingOwner(permissions.BasePermission):
	def has_object_permission(self, request, view, mealIng):
		'''handles permissions for editing the object'''
		if request.user:
			creator = (mealIng.meal_plan.day).diet.creator
			return creator == request.user
		return False

