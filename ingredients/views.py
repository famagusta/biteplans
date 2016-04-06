'''api views for our ingredients'''
from ingredients.models import USDAIngredient
from recipes.models import Recipe
from authentication.models import Account
from dietplans.models import DietPlan
from dietplans.serializers import DietPlanSerializer
from ingredients.serializers import IngredientSerializer
from recipes.serializers import RecipeSerializer
from authentication.serializers import AccountSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core import serializers


class GlobalSearchList(APIView):
    '''creates serializer of the queryset'''
    def post(self, request):
        '''Handles post request'''
        query = request.POST.get('query', False)
        topic = request.POST.get('type', None)
        result = None
        if topic == 'ingredients':
            result = USDAIngredient.objects.filter(shrt_desc__search=query)
            result = IngredientSerializer(result, many=True)
        elif topic == 'recipes':
            result = Recipe.objects.filter(name__search=query)
            result = RecipeSerializer(result, many=True)
        elif topic == 'plans':
            result = DietPlan.objects.filter(name__search=query)
            result = DietPlanSerializer(result, many=True)
        return Response(result.data)
