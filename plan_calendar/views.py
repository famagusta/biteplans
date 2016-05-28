# Create your views here.
'''Views for planCalendar'''
from plan_calendar.models import UserPlanHistory, MealHistory, \
    MyIngredient, MyRecipe, EventIngredient, EventRecipe, MyPlans
from plan_calendar.serializers import UserPlanHistorySerializer,\
    UserPlnHistorySerializer, MealHistorySerializer, MealHistoryWriteSerializer, \
    MyIngredientSerializer, MyIngredientWriteSerializer, MyRecipeSerializer, \
    MyRecipeWriteSerializer, EventIngredientSerializer, EventIngSerializer,\
    EventRecipeSerializer, EventRecpSerializer, MyPlanSerializer, \
    MyPlanWriteSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import permissions, viewsets, generics, status
from authentication.permissions import IsFollowing, IsEventMealHistoryOwner
from django.core import serializers
import hashlib
import datetime
import random
from rest_framework import status
import traceback
import logging
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import math


class FollowDietViewSet(viewsets.ModelViewSet):
    '''view to allow users to follow plans'''

    serializer_class = UserPlanHistorySerializer

    def get_queryset(self):
        '''returns queryset for get method'''
        month = self.request.GET.get('month', False)
        if month:
            '''return entire months plans '''
            temparr = date.split('-')
            month = int(temparr[1])
            year = int(temparr[0])
            return UserPlanHistory.objects.filter(start_date__month=month,
                                                  start_date__year=year,
                                                  user=self.request.user)
        else:
            return UserPlanHistory.objects.filter(user=self.request.user)

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
            other_followed_plans = self.get_queryset()
            new_start_date = serializer.validated_data['start_date']
            diet_plan_to_follow = serializer.validated_data['dietplan']
            new_end_date = new_start_date + \
            datetime.timedelta(days=diet_plan_to_follow.duration*7-1)
            check_overlap_flag = False
            for i in other_followed_plans:
                enddate = i.start_date + datetime.timedelta(
                                            days=i.dietplan.duration*7-1)
                if new_start_date < enddate and new_end_date > i.start_date:
                    check_overlap_flag = True
                if check_overlap_flag:
                    break
            if check_overlap_flag == False:
                obj = UserPlanHistory.objects.create(user=request.user,
                                            **serializer.validated_data)
                return Response({'userplanhistory_id': obj.id},
                                status=status.HTTP_201_CREATED)
            else:
                return Response({'error':'This plan overlaps with an existing\
                 plan you are following'}, status=status.HTTP_409_CONFLICT)
        else:
            # print serializer.errors
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


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
            return Response({'mealhistory_id': obj.id},
                            status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        '''returns queryset for get method'''
        date = request.GET.get('date', False)
        if date:
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
    # TODO below function is not correct, allow only plan follower
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
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        if serializer.is_valid():
            obj = MyIngredient.objects.create(**serializer.validated_data)
            return Response({'myingredient': obj.id},
                            status=status.HTTP_201_CREATED)
        else:
            # print serializer.errors
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        '''returns queryset for get method'''
        user = request.user
        if user is not None:
            result = self.queryset.filter(user=request.user)
        else:
            result = self.queryset

        page = request.GET.get('page')
        paginator = Paginator(result, 6)

        try:
            result = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            result = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            result = paginator.page(paginator.num_pages)
        total = math.ceil(len(result)/6.0)
        result = self.serializer_class(result, many=True)
        return Response({"results":result.data, "total":total},
                        status=status.HTTP_200_OK)



class EventRecipesViewSet(viewsets.ModelViewSet):
    '''view to allow users to follow plans'''
    serializer_class = EventRecipeSerializer
    queryset = EventRecipe.objects.all()
    # TODO below function is not correct, allow only plan follower
    # to edit stuff

    def get_permissions(self):
        '''return allowed permissions'''
        if self.request.method in permissions.SAFE_METHODS:
            self.serializer_class = EventRecipeSerializer
            return (permissions.IsAuthenticated(), )
        else:
            self.serializer_class = EventRecpSerializer
            return (IsEventMealHistoryOwner(), )

class MyRecipeViewset(viewsets.ModelViewSet):
    queryset = MyRecipe.objects.all()
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
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        if serializer.is_valid():
            obj = MyRecipe.objects.create(**serializer.validated_data)
            return Response({'myrecipe_id': obj.id},
                            status=status.HTTP_201_CREATED)
        else:
            # print serializer.errors
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        '''returns queryset for get method'''
        user = request.user
        if user is not None:
            result = self.queryset.filter(user=request.user)
        else:
            result = self.queryset

        page = request.GET.get('page')
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

class MyPlanViewset(viewsets.ModelViewSet):
    queryset = MyPlans.objects.all()
    serializer_class = MyPlanSerializer

    def get_permissions(self):
        '''return allowed permissions'''
        if self.request.method in permissions.SAFE_METHODS:
            self.serializer_class = MyPlanSerializer
            return (permissions.IsAuthenticated(), )
        if self.request.method == 'POST':
            self.serializer_class = MyPlanWriteSerializer
            return (permissions.IsAuthenticated(), )
        else:
            self.serializer_class = MyPlanWriteSerializer
            return (IsFollowing(),)

    def create(self, request):
        '''Creates the model instance dietplans'''
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        if serializer.is_valid():
            obj = MyPlans.objects.create(**serializer.validated_data)
            return Response({'myplan_id': obj.id},
                            status=status.HTTP_201_CREATED)
        else:
            # print serializer.errors
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        '''returns queryset for get method'''
        user = request.user
        if user is not None:
            result = self.queryset.filter(user=request.user)
        else:
            result = self.queryset

        page = request.GET.get('page')
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
