from rest_framework import permissions

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
