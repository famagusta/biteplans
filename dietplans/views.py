'''api views for our bitespace_app'''
from recipes.models import Recipe, RecipeIngredients
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import permissions
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework import permissions, viewsets, generics, status
from authentication.permissions import IsPlanOwner, IsDayMealOwner
from rest_framework.decorators import api_view, permission_classes
from django.core import serializers
import hashlib
import datetime
import random
from dietplans.models import DietPlan, DayPlan, MealPlan
from dietplans.serializers import DietPlanSerializer, DayPlanSerializer,\
    MealRecipeSerializer, MealPlanSerializer
from rest_framework import status


class DietPlanViewset(viewsets.ModelViewSet):
    '''view to return JSON for crud related to DietPlans'''
    serializer_class = DietPlanSerializer
    queryset = DietPlan.objects.all()

    def get_permissions(self):
        '''return allowed permissions'''
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        if self.request.method == 'POST':
            return (permissions.IsAuthenticated(), )
        return (permissions.IsPlanOwner(),)

    def create(self, request):
        '''Creates the model instance dietplans'''
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            obj = DietPlan.objects.create(creator=request.user,
                                          **serializer.validated_data)
            obj.creator = request.user
            obj.save()
            return Response({'dietplan_id': obj.id}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'invalid data'},
                            status=status.HTTP_400_BAD_REQUEST)

    def update(self, request):
        '''Updates existing model instance based on
        the properties provided in the queryset'''
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            obj = serializer.save()
            return Response({'dietplan_id': obj.id},
                            status=status.HTTP_200_OK)
        else:
            return Response({'error': 'invalid data'},
                            status=status.HTTP_400_BAD_REQUEST)


class DayPlanViewSet(generics.ListAPIView):
    '''view to return JSON for crud related to DayPlan
    Only list method is allowed and only get is allowed'''
    serializer_class = DayPlanSerializer

    def get_queryset(self):
        '''return queryset to be returned'''
        diet = self.kwargs['diet']
        dietplan = DietPlan.objects.get(pk=diet)
        return DayPlan.objects.filter(diet=dietplan)


class MealPlanViewSet(viewsets.ModelViewSet):
    '''view to return JSON for crud related to DayPlan
    Only list method is allowed and only get is allowed'''
    serializer_class = MealPlanSerializer
    queryset = MealPlan.objects.all()

    def get_permissions(self):
        '''return allowed permissions'''
        if self.request.method in permissions.SAFE_METHODS:
            print "burra"
            return (permissions.AllowAny(),)
        elif self.request.method in ('POST', 'PUT', 'DELETE'):
            print "hello", self.request.method
            print IsDayMealOwner()
            return (IsDayMealOwner(), )

    def create(self, request):
        '''Creates the model instance mealplans'''
        serializer = self.serializer_class(data=request.data)
        print request.data
        if serializer.is_valid():
            # dayplan = DayPlan.objects.get(request.data['day'])
            obj = MealPlan.objects.create(
                **serializer.validated_data)

            obj.save()
            return Response({'mealplanid': obj.id},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'invalid data'},
                            status=status.HTTP_400_BAD_REQUEST)

    def update(self, request):
        '''Updates existing model instance based on
        the properties provided in the queryset'''
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            obj = serializer.save()
            return Response({'mealplanid': obj.id},
                            status=status.HTTP_200_OK)
        else:
            return Response({'error': 'invalid data'},
                            status=status.HTTP_400_BAD_REQUEST)
