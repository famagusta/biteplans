'''api views for our ingredients'''
from ingredients.models import Ingredient, AddtnlIngredientInfo
from recipes.models import Recipe
from authentication.models import Account
from dietplans.models import DietPlan
from dietplans.serializers import DietPlanSerializer
from ingredients.serializers import IngredientSerializer,\
AddtnlInfoIngSerializer
import json
from recipes.serializers import RecipeSerializer
from authentication.serializers import AccountSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core import serializers
from rest_framework import viewsets, generics
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import math

class GlobalSearchList(generics.GenericAPIView):
    '''creates serializer of the queryset'''
    def get_serializer_class(self):
        if self.request.data['type'] == 'ingredients':
            return IngredientSerializer
        elif self.request.data['type'] == 'recipes':
            return RecipeSerializer
        else:
            return DietPlanSerializer

    def get_queryset(self):
        query = self.request.data['query']
        if self.request.data['type'] == 'ingredients':
            return Ingredient.objects.filter(name__search=query)
        elif self.request.data['type'] == 'recipes':
            return Recipe.objects.filter(name__search=query)
        elif self.request.data['type'] == 'plans':
            return DietPlan.objects.filter(name__search=query)

    def post(self, request):
        '''Handles post request'''
        result = self.get_queryset()

        food_group = request.POST.get('food_group', False)

        filters = result.values_list("food_group").distinct()

        if food_group != False:
            food_group = json.loads(food_group)
            res = []
            print len(food_group)
            for i in food_group:
                res += result.filter(food_group=i)

            result = res



        total = math.ceil(len(result)/6.0)
        paginator = Paginator(result, 6)
        page = request.GET.get('page')
        serializer = self.get_serializer_class()
        try:
            result = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            result = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            result = paginator.page(paginator.num_pages)

        result = serializer(result, many=True)
        return Response({"results":result.data, "total":total,
                        "filters":filters})


class GetFilters(generics.GenericAPIView):
    '''creates serializer of the queryset'''
    def get(self, request):
        '''get request'''
        filter_list = Ingredient.objects.order_by().\
        values_list('food_group').distinct()
        filter_list = {"filters":filter_list}
        return Response(json.dumps(filter_list))


class GetCompleteIngredientInfo(generics.RetrieveAPIView):
    '''retrieve additional info API, allows get with pk only'''
    lookup_field = 'ingredient'
    queryset = AddtnlIngredientInfo.objects.all()
    serializer_class = AddtnlInfoIngSerializer


# class IngredientUnitsViewset(viewsets.ReadOnlyModelViewSet):
#     queryset = IngredientCommonMeasures.objects.all()
#     serializer_class = IngredientSerializer
