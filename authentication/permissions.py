from rest_framework import permissions
from dietplans.models import DayPlan

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


class IsDayMealOwner(permissions.BasePermission):
	def has_permission(self, request, view):
		'''handles permission for getting/creating'''
		if request.method == "POST" and request.user.is_authenticated():
			day = DayPlan.objects.get(pk=request.data['day'])
			return day.diet.creator == request.user

		return False

	def has_object_permission(self, request, view, meal):
		'''handles permissions for editing the object'''
		if request.user:
			creator = (meal.day).diet.creator
			return creator == request.user
		return False
