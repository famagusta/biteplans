# Create your views here.
'''Views for planCalendar'''
from plan_calendar.models import UserPlanHistory, MealHistory, \
MyIngredient, MyRecipe, EventIngredient
from plan_calendar.serializers import UserPlanHistorySerializer,\
UserPlnHistorySerializer, MealHistorySerializer, MealHistoryWriteSerializer, \
MyIngredientSerializer, MyIngredientWriteSerializer, MyRecipeSerializer, \
MyRecipeWriteSerializer, EventIngredientSerializer, EventIngSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import permissions, viewsets, generics, status
from authentication.permissions import IsFollowing, IsEventMealHistoryOwner
from django.core import serializers
import hashlib, datetime, random
from rest_framework import status
import traceback
import logging

class FollowDietViewSet(viewsets.ModelViewSet):
	'''view to allow users to follow plans'''
	def get_queryset(self):
		'''returns queryset for get method'''
		date = self.request.GET.get('date', False)
		if date != False:
			temparr = date.split('-')
			print temparr
			return UserPlanHistory.objects.filter(start_date__month=int(temparr[1]),
			                                      start_date__year=int(temparr[0]),
		                                  user=self.request.user)
		else:
			return UserPlanHistory.objects.filter(user=self.request.user)

	serializer_class = UserPlanHistorySerializer

	def get_permissions(self):
		'''return allowed permissions'''
		if self.request.method in permissions.SAFE_METHODS:
			self.serializer_class = UserPlanHistorySerializer
			return (permissions.IsAuthenticated(), )
		if self.request.method == 'POST':
			self.serializer_class = UserPlnHistorySerializer
			return (permissions.IsAuthenticated(), )
		else:
			self.serializer_class = UserPlnHistorySerializer
			return (IsFollowing(),)

	def create(self, request):
		'''Creates the model instance dietplans'''
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid():
			obj = UserPlanHistory.objects.create(user=request.user,
		                              **serializer.validated_data)
			return Response({'userplanhistory_id':obj.id},
		                status=status.HTTP_201_CREATED)
		else:
			print serializer.errors
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class MealHistoryViewSet(viewsets.ModelViewSet):
	'''view to allow users to follow plans'''
	serializer_class = MealHistorySerializer
	lookup_field = 'id'
	queryset = MealHistory.objects.all()

	def get_permissions(self):
		'''return allowed permissions'''
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.IsAuthenticated(), )
		elif self.request.method == "POST":
			self.serializer_class = MealHistoryWriteSerializer
			return (permissions.IsAuthenticated(), )
		else:
			self.serializer_class = MealHistoryWriteSerializer
			return (IsFollowing(), )

	def create(self, request):
		'''creates meal history registry'''
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid():
			obj = MealHistory.objects.create(user=request.user,
		                              **serializer.validated_data)
			return Response({'mealhistory_id':obj.id},
		                status=status.HTTP_201_CREATED)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def list(self, request):
		'''returns queryset for get method'''
		date = request.GET.get('date', False)
		if date != False:
			obj = MealHistory.objects.filter(date=date,
		                                  user=request.user)
		else:
			obj = MealHistory.objects.filter(user=request.user)

		obj = self.serializer_class(obj, many=True)
		return Response(obj.data, status=status.HTTP_200_OK)


class EventIngredientsViewSet(viewsets.ModelViewSet):
    '''view to allow users to follow plans'''
    serializer_class = EventIngredientSerializer
    queryset = EventIngredient.objects.all()
	#TODO below function is not correct, allow only plan follower
    # to edit stuff
    def get_permissions(self):
		'''return allowed permissions'''
		if self.request.method in permissions.SAFE_METHODS:
			self.serializer_class = EventIngredientSerializer
			return (permissions.IsAuthenticated(), )
		else:
			self.serializer_class = EventIngSerializer
			return (IsEventMealHistoryOwner(), )


class MyIngredientsViewset(viewsets.ModelViewSet):
	queryset = MyIngredient.objects.all()
	lookup_field = 'user'
	serializer_class = MyIngredientSerializer

	def get_permissions(self):
		'''return allowed permissions'''
		if self.request.method in permissions.SAFE_METHODS:
			self.serializer_class = MyIngredientSerializer
			return (permissions.IsAuthenticated(), )

		if self.request.method == 'POST':
			self.serializer_class = MyIngredientWriteSerializer
			return (permissions.IsAuthenticated(), )
		else:
			self.serializer_class = MyIngredientWriteSerializer
			return (IsFollowing(),)

	def create(self, request):
		'''Creates the model instance dietplans'''
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid():
			print serializer.validated_data
			obj = MyIngredient.objects.create(user=request.user,
		                              **serializer.validated_data)
			return Response({'myingredient':obj.id},
		                status=status.HTTP_201_CREATED)
		else:
			print serializer.errors
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyRecipeViewset(viewsets.ModelViewSet):
	queryset = MyRecipe.objects.all()
	lookup_field = 'user'
	serializer_class = MyRecipeSerializer

	def get_permissions(self):
		'''return allowed permissions'''
		if self.request.method in permissions.SAFE_METHODS:
			self.serializer_class = MyRecipeSerializer
			return (permissions.IsAuthenticated(), )
		if self.request.method == 'POST':
			self.serializer_class = MyRecipeWriteSerializer
			return (permissions.IsAuthenticated(), )
		else:
			self.serializer_class = MyRecipeWriteSerializer
			return (IsFollowing(),)

	def create(self, request):
		'''Creates the model instance dietplans'''
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid():
			print serializer.validated_data
			obj = MyRecipe.objects.create(user=request.user,
		                              **serializer.validated_data)
			return Response({'myrecipe_id':obj.id},
		                status=status.HTTP_201_CREATED)
		else:
			print serializer.errors
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
