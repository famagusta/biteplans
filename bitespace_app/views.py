'''api views for our bitespace_app'''
from rest_framework import generics
from bitespace_app.models import USDAIngredient
from bitespace_app.serializers import GlobalSearchSerializer

class GlobalSearchList(generics.ListAPIView):
    '''creates serializer of the queryset'''
    serializer_class = GlobalSearchSerializer
    def get_queryset(self):
        query = self.request.query_params.get('query', None)
        result = USDAIngredient.objects.filter(shrt_desc__icontains=query)
        return result
