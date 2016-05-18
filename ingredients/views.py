'''api views for our ingredients'''
from ingredients.models import Ingredient, AddtnlIngredientInfo
from recipes.models import Recipe, RecipeNutrition
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
    sortlist = None
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
            self.sortlist = Ingredient._meta.fields
            return Ingredient.objects.all().filter(name__search=query)
        elif self.request.data['type'] == 'recipes':
            self.sortlist = Recipe._meta.fields
            return Recipe.objects.all().filter(name__search=query)
        elif self.request.data['type'] == 'plans':
            print query
            self.sortlist = DietPlan._meta.fields
            return DietPlan.objects.all().filter(name__search=query)

    def post(self, request):
        '''Handles post request'''
        result = self.get_queryset()
        ##Filters are only applicable for ingredients,
        ##so this gathers the list of possible filters
        if request.POST.get('type', False) == 'ingredients' \
        or request.POST.get('type', False) == 'plans':
            filters = result.values_list("food_group").distinct()

            food_group = request.POST.get('food_group', False)

            ##This gather the list of sort options
            sortl = []
            for i in self.sortlist:
                if str(type(i)) == \
                "<class 'django.db.models.fields.DecimalField'>":
                    sortl.append(i.name)
            self.sortlist = None

            ##this  hecks if sort by is reuested and applies it if
            ##that is the case

            sortby = request.POST.get('sortby', False)
            if sortby != False:
                result = result.order_by('-'+sortby)

            ##this applies filters
            if food_group != False:
                food_group = json.loads(food_group)
                res = []
                for i in food_group:
                    res += result.filter(food_group=i)
                result = res

        elif request.POST.get('type', False) == 'recipes':
            ##This gather the list of sort options
            sortl = []
            filters = None
            for i in self.sortlist:
                if str(type(i)) == \
                "<class 'django.db.models.fields.DecimalField'>":
                    sortl.append(i.name)
            self.sortlist = None

            ##this  hecks if sort by is reuested and applies it if
            ##that is the case

            sortby = request.POST.get('sortby', False)
            if sortby != False:
                result = result.order_by('-'+sortby)

        ##total number of pages
        total = math.ceil(len(result)/6.0)

        ##pagination for 6 results in each page
        paginator = Paginator(result, 6)
        page = request.GET.get('page')
        serializer = self.get_serializer_class()
        try:
            result = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            result = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999),
            ##deliver last page of results.
            result = paginator.page(paginator.num_pages)

        result = serializer(result, many=True)
        return Response({"results":result.data, "total":total,
                        "filters":filters, "sortlist":sortl})


class GetCompleteIngredientInfo(generics.RetrieveAPIView):
    '''retrieve additional info API, allows get with pk only'''
    lookup_field = 'ingredient'
    queryset = AddtnlIngredientInfo.objects.all()
    serializer_class = AddtnlInfoIngSerializer


# class IngredientUnitsViewset(viewsets.ReadOnlyModelViewSet):
#     queryset = IngredientCommonMeasures.objects.all()
#     serializer_class = IngredientSerializer
