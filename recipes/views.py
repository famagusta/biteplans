'''Views for recipes'''
from recipes.models import Recipe, RecipeIngredients, RecipeNutrition,\
RecipeRating
from recipes.serializers import RecipeSerializer, \
RecipeReadSerializer, RecipeIngSerializer, RecipeNutritionSerializer,\
RecipeRatingSerializer
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

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import math

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
		page = request.GET.get('page')
		self.serializer_class = RecipeReadSerializer
		if user != None:
			result = self.queryset.filter(created_by=request.user)
		else:
			result = self.queryset
		paginator = Paginator(result, 3)

		try:
			result = paginator.page(page)
		except PageNotAnInteger:
        	# If page is not an integer, deliver first page.
			result = paginator.page(1)
		except EmptyPage:
        	# If page is out of range (e.g. 9999), deliver last page of results.
			result = paginator.page(paginator.num_pages)
		total = math.ceil(len(result)/3.0)
		result = self.serializer_class(result, many=True)
		return Response({"results":result.data, "total":total},
		                status=status.HTTP_200_OK)


class RecipeRatingViewSet(viewsets.ModelViewSet):
    '''view to return json for crud related to a plan rating'''
    serializer_class = RecipeRatingSerializer
    queryset = RecipeRating.objects.all()
    def get_queryset(self):
        '''returns queryset for get method'''
        recipe = self.request.GET.get('recipe', False)
        if recipe:
            return RecipeRating.objects.filter(user=self.request.user,
                                             recipe=recipe)
        else:
            return RecipeRating.objects.filter(user=self.request.user)
    def get_permissions(self):
        '''return allowed permissions'''
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        if self.request.method in ['POST', 'PATCH']:
            return (permissions.IsAuthenticated(), )
    def create(self, request):
        '''create an instance of rating'''
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        if serializer.is_valid():
            obj = RecipeRating.objects.create(**serializer.validated_data)
            obj.save()
            return Response({'recipeRating_id': obj.id},
                            status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


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


class GetCompleteRecipeInfo(generics.RetrieveAPIView):
    '''retrieve additional info API, allows get with pk only'''
    lookup_field = 'recipe'
    queryset = RecipeNutrition.objects.all()
    serializer_class = RecipeNutritionSerializer
