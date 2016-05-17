'''Views for recipes'''
from recipes.models import Recipe, RecipeIngredients
from recipes.serializers import RecipeSerializer, \
RecipeReadSerializer, RecipeIngSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import permissions, viewsets, generics, status
from authentication.permissions import IsPlanOwner, IsDayMealOwner, \
IsMealOwner, IsRecipeOwner, IsRecipeIngOwner, IsRecipeIngrOwner
from django.core import serializers
import hashlib, datetime, random
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser


class RecipeViewSet(viewsets.ModelViewSet):
	queryset = Recipe.objects.all()
	serializer_class = RecipeSerializer
	def get_permissions(self):
		'''return allowed permissions'''
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.AllowAny(),)
		if self.request.method == 'POST':
			return (permissions.IsAuthenticated(), )
		else:
			return (IsRecipeOwner(),)

	def create(self, request):
		'''Creates the model instance dietplans'''
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid():
			obj = Recipe.objects.create(created_by=request.user,
			                              **serializer.validated_data)
			obj.created_by = request.user
			obj.save()
			return Response({'recipe_id':obj.id}, status=status.HTTP_201_CREATED)
		else:
			print serializer.errors
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


	def list(self, request):
		'''returns queryset for get method'''
		user = request.user
		self.serializer_class = RecipeReadSerializer
		if user != None:
			obj = self.queryset.filter(created_by=request.user)
		else:
			obj = self.queryset

		obj = self.serializer_class(obj, many=True)
		return Response(obj.data, status=status.HTTP_200_OK)


class RecipeIngredientViewSet(viewsets.ModelViewSet):
	queryset = RecipeIngredients.objects.all()
	serializer_class = RecipeIngSerializer
	def get_permissions(self):
		'''return allowed permissions'''
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.IsAuthenticated(),)
		if self.request.method == 'POST':
			return (IsRecipeIngOwner(), )
		return (IsRecipeIngrOwner(),)

	def create(self, request):
		'''Creates the model instance dietplans'''
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid():
			obj = RecipeIngredients.objects.create(**serializer.validated_data)
			obj.save()
			return Response({'recipe_ing_id':obj.id}, status=status.HTTP_201_CREATED)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



