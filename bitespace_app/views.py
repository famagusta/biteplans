'''api views for our bitespace_app'''
from rest_framework import generics
from bitespace_app.models import USDAIngredient
from bitespace_app.serializers import GlobalSearchSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

class GlobalSearchList(APIView):
    '''creates serializer of the queryset'''
    def get(self,request):
        query = self.request.query_params.get('query', None)
        result = USDAIngredient.objects.filter(shrt_desc__icontains=query)
        result = GlobalSearchSerializer(result,many=True)
        return Response(result.data)

    def post(self,request):
        print self.request.POST
        query = self.request.POST.get('query',False)
        result = USDAIngredient.objects.filter(shrt_desc__icontains=query)
        result = GlobalSearchSerializer(result,many=True)
        return Response(result.data)
