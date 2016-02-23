'''api views for our bitespace_app'''
from bitespace_app.models import USDAIngredient
from bitespace_app.models import Recipe
from authentication.models import Account
from bitespace_app.serializers import GlobalSearchSerializer
from bitespace_app.serializers import RecipeSearchSerializer
from authentication.serializers import AccountSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

class GlobalSearchList(APIView):
    '''creates serializer of the queryset'''
    def get(self, request):
        '''Handles get request'''
        query = request.query_params.get('query', None)
        result = USDAIngredient.objects.filter(shrt_desc__search=query)
        result = GlobalSearchSerializer(result, many=True)
        return Response(result.data)

    def post(self, request):
        '''Handles post request'''
        query = request.POST.get('query', False)
        result = USDAIngredient.objects.filter(shrt_desc__search=query)
        result = GlobalSearchSerializer(result, many=True)
        return Response(result.data)

class RecipeSearchList(APIView):
    '''creates serializer of the queryset for recipes'''
    def get(self, request):
        '''Handles get request'''
        query = request.query_params.get('query', None)
        result = Recipe.objects.filter(name__search=query)
        result = RecipeSearchSerializer(result, many=True)
        return Response(result.data)

    def post(self, request):
        '''Handles post request'''
        query = request.POST.get('query', False)
        result = Recipe.objects.filter(name__search=query)
        result = RecipeSearchSerializer(result, many=True)
        return Response(result.data)
    
class AccountDetail(APIView):
    '''creates serializer of the queryset'''
    permission_classes = (IsAuthenticated, )
    authentication_classes = (JSONWebTokenAuthentication, )
    def get(self, request):
        '''Handles get request'''
        query = request.user
        result = AccountSerializer(query)
        return Response(result.data)

    def post(self, request):
        '''Handles post request'''
        query = request.user
        result = AccountSerializer(query)
        return Response(result.data)


