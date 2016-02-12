'''api views for our bitespace_app'''
from bitespace_app.models import USDAIngredient
from authentication.models import Account
from bitespace_app.serializers import GlobalSearchSerializer
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

class AccountDetail(APIView):
    '''creates serializer of the queryset'''
    permission_classes = (IsAuthenticated, )
    authentication_classes = (JSONWebTokenAuthentication, )
    def get(self, request):
        '''Handles get request'''
        query = request.query_params.get('username', None)
        result = Account.objects.get(username=query)
        result = AccountSerializer(result)
        return Response(result.data)

    def post(self, request):
        '''Handles post request'''
        query = request.POST.get('username', False)
        result = Account.objects.get(username=query)
        result = AccountSerializer(result)
        return Response(result.data)

