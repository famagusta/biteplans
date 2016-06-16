'''api views for our bitespace_app'''
from recipes.models import Recipe, RecipeIngredients
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import permissions
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework import permissions, viewsets, generics, status
from authentication.permissions import IsPlanOwner, IsDayMealOwner, \
    IsMealOwner, IsMealingOwner, IsDayMealrOwner
from rest_framework.decorators import api_view, permission_classes
from django.core import serializers
from django.shortcuts import get_list_or_404, get_object_or_404
import hashlib
import datetime
import random
from dietplans.models import DietPlan, DayPlan, MealPlan, \
    MealIngredient, MealRecipe, PlanRating
from dietplans.serializers import DietPlanSerializer, DayPlanSerializer,\
    MealPlanSerializer, MealIngSerializer, MealRecpSerializer, \
    CopySerializer, PlanRatingSerializer

from rest_framework import status

import traceback
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import math

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
        return (IsPlanOwner(),)

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
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


    def list(self, request):
        '''returns queryset for get method'''
        user = request.user
        page = request.GET.get('page')
        search_plan_populate = request.GET.get('search_plan_populate')
        
        if (not user.is_anonymous()) and (search_plan_populate is None):
            result = self.queryset.filter(creator=request.user)
        else:
            result = [dietplan for dietplan in self.queryset.order_by('-date_published') if dietplan.is_complete][:4]
            
        no_plan_per_page = 2.0
        if search_plan_populate is not None :
            no_plan_per_page = 4.0
            
        total = math.ceil(len(result)/no_plan_per_page)
        paginator = Paginator(result, no_plan_per_page)
        
        try:
            result = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            result = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            result = paginator.page(paginator.num_pages)
        
        result = self.serializer_class(result, many=True)
        return Response({"results":result.data, "total":total},
                        status=status.HTTP_200_OK)



class PlanRatingViewSet(viewsets.ModelViewSet):
    '''view to return json for crud related to a plan rating'''
    serializer_class = PlanRatingSerializer
    queryset = PlanRating.objects.all()
    
    def get_queryset(self):
        '''returns queryset for get method'''
        dietPlan = self.request.GET.get('dietPlan', False)
        user = self.request.user
        if (dietPlan and (not user.is_anonymous())):
            return PlanRating.objects.filter(user=self.request.user,
                                             dietPlan=dietPlan)
        elif (not user.is_anonymous()):
            return PlanRating.objects.filter(user=self.request.user)
        else:
            return []
    
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
            obj = PlanRating.objects.create(**serializer.validated_data)
            obj.save()
            return Response({'planRating_id': obj.id}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        
        
class DayPlanViewSet(generics.ListAPIView):
    '''view to return JSON for crud related to DayPlan
    Only list method is allowed and only get is allowed'''
    serializer_class = DayPlanSerializer

    def get_queryset(self):
        ''''''
        diet = self.kwargs['diet']
        return DayPlan.objects.filter(diet=diet)


class DayPlnViewSet(generics.RetrieveAPIView):
    '''view to return JSON for crud related to DayPlan
    Only list method is allowed and only get is allowed'''
    serializer_class = DayPlanSerializer
    queryset = DayPlan.objects.all()

    def get_object(self):
        obj = DayPlan.objects.get(diet=self.kwargs['diet'],
                                  day_no=self.kwargs['day_no'],
                                  week_no=self.kwargs['week_no'])
        self.check_object_permissions(self.request, obj)
        return obj


class MealPlanViewSet(viewsets.ModelViewSet):
    '''view to return JSON for crud related to DayPlan
    Only list method is allowed and only get is allowed'''
    serializer_class = MealPlanSerializer
    queryset = MealPlan.objects.all()

    def get_permissions(self):
        '''return allowed permissions'''
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        elif self.request.method == 'POST':
            return (IsDayMealOwner(), )
        return (IsDayMealrOwner(), )

    def create(self, request):
        '''Creates the model instance mealplans'''
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # dayplan = DayPlan.objects.get(request.data['day'])
            obj = MealPlan.objects.create(
                **serializer.validated_data)

            obj.save()
            return Response({'mealplanid': obj.id},
                            status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


class MealIngredientViewSet(viewsets.ModelViewSet):
    '''view to return JSON for crud related to DayPlan
    Only list method is allowed and only get is allowed'''
    serializer_class = MealIngSerializer
    queryset = MealIngredient.objects.all()

    def get_permissions(self):
        '''return allowed permissions'''
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        elif self.request.method == 'POST':
            return (IsMealOwner(), )
        else:
            return (IsMealingOwner(), )

    def create(self, request):
        '''Creates the model instance mealplans'''
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # dayplan = DayPlan.objects.get(request.data['day'])
            obj = MealIngredient.objects.create(
                **serializer.validated_data)

            obj.save()
            return Response({'meal_ingredient_id': obj.id},
                            status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


class MealRecipeViewSet(viewsets.ModelViewSet):
    '''view to return JSON for crud related to MealRecipe'''
    serializer_class = MealRecpSerializer
    queryset = MealRecipe.objects.all()

    def get_permissions(self):
        '''return allowed permissions'''
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        elif self.request.method == 'POST':
            return (IsMealOwner(), )
        else:
            return (IsMealingOwner(), )

    def create(self, request):
        '''Creates the model instance mealplans'''
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # dayplan = DayPlan.objects.get(request.data['day'])
            obj = MealRecipe.objects.create(
                **serializer.validated_data)

            obj.save()
            return Response({'meal_recipe_id': obj.id},
                            status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


class CopyViewSet(generics.GenericAPIView):
    '''copies the day plan to other day plan'''
    serializer_class = CopySerializer

    def get_permissions(self):
        '''return allowed permissions'''
        if self.request.method == 'POST':
            return (permissions.IsAuthenticated(), )

    def post(self, request):
        srlzr = self.serializer_class(data=request.data)
        if srlzr.is_valid():
            try:
                dietplan = get_object_or_404(
                    DietPlan,
                    id=srlzr.validated_data['dietplan'])

                if dietplan.creator != request.user:
                    raise ValueError("Not authorized for this function")

                from_day = get_object_or_404(
                    DayPlan,
                    day_no=srlzr.validated_data['from_day'],
                    week_no=srlzr.validated_data['from_week'],
                    diet=dietplan)

                to_day = get_object_or_404(
                    DayPlan,
                    day_no=srlzr.validated_data['to_day'],
                    week_no=srlzr.validated_data['to_week'],
                    diet=dietplan)

                from_day_mealplan = from_day.mealplan.all().order_by('id')
                to_day_mealplan = to_day.mealplan.all().order_by('id')

                # delete any existing mealplans on the to_day
                for i in range(len(from_day_mealplan), len(to_day_mealplan)):
                    to_day_mealplan[i].delete()

                for i in range(len(from_day_mealplan)):
                    if i < len(to_day_mealplan):
                        to_day_mealplan[i].name = from_day_mealplan[i].name
                        to_day_mealplan[i].time = from_day_mealplan[i].time
                        new_meal_plan = to_day_mealplan[i]
                    else:
                        new_meal_plan = MealPlan.objects.create(
                            day=to_day,
                            name=from_day_mealplan[i].name,
                            time=from_day_mealplan[i].time)
                    mealings = new_meal_plan.mealingredient.all()
                    mealrecipe = new_meal_plan.mealrecipe.all()
                    frommealings = from_day_mealplan[i].mealingredient.all()
                    fromrecipes = from_day_mealplan[i].mealrecipe.all()

                    for j in range(len(frommealings), len(mealings)):
                        mealings[j].delete()

                    for j in range(len(fromrecipes), len(mealrecipe)):
                        mealrecipe[j].delete()

                    for k in range(len(frommealings)):
                        if k < len(mealings):
                            mealings[k].ingredient = frommealings[k].ingredient
                            mealings[k].unit = frommealings[k].unit
                            mealings[k].quantity = frommealings[k].quantity
                            mealings[k].meal_plan = new_meal_plan

                        else:
                            MealIngredient.objects.create(
                                ingredient=frommealings[k].ingredient,
                                unit=frommealings[k].unit,
                                quantity=frommealings[k].quantity,
                                meal_plan=new_meal_plan)

                    for k in range(len(fromrecipes)):
                        if k < len(mealrecipe):
                            mealrecipe[k].recipe = fromrecipes[k].recipe
                            mealrecipe[k].servings = fromrecipes[k].servings
                            mealrecipe[k].meal_plan = new_meal_plan

                        else:
                            MealRecipe.objects.create(
                                recipe=fromrecipes[k].recipe,
                                servings=fromrecipes[k].servings,
                                meal_plan=new_meal_plan)

                return Response({"success": "copied"},
                                status=status.HTTP_200_OK)
            except Exception as error:
                traceback.print_exc()
                return Response({"error": repr(error)},
                                status=status.HTTP_400_BAD_REQUEST)
