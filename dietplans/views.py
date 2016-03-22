'''api views for our bitespace_app'''
from bitespace_app.models import Recipe, RecipeIngredients, IngredientQuantity
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework import permissions, viewsets, generics, status
from authentication.permissions import IsPlanOwner
from rest_framework.decorators import api_view, permission_classes
from django.core import serializers
import hashlib, datetime, random
from dietplans.models import DietPlan
from dietplans.serializers import DietPlanSerializer
from rest_framework import status

# Create your views here.

class DietPlanViewset(viewsets.ModelViewSet):
	'''view to return JSON for crud related to DietPlans'''
	serializer_class = DietPlanSerializer
	queryset = DietPlan.objects.all()
	permission_classes = (IsAuthenticatedOrReadOnly, IsPlanOwner, )

	def create(self, request):
		'''Creates the model instance dietplans'''
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid():
			obj = DietPlan.objects.create(creator=request.user,
			                              **serializer.validated_data)
			obj.createdby = request.user
			obj.save()
			obj = serializers.serialize('json', [obj, ])
			return Response(obj)
		else:
			return Response({'error':'invalid data'}, status=status.HTTP_400_BAD_REQUEST)

	def update(self, request):
		'''Updates existing model instance based on
		the properties provided in the queryset'''
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid():
			obj = serializer.save()
			obj = serializers.serialize('json', [obj, ])
			return Response(obj)
		else:
			return Response({'error':'invalid data'}, status=status.HTTP_400_BAD_REQUEST)
