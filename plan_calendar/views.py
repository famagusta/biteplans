# Create your views here.
'''Views for planCalendar'''
from plan_calendar.models import UserPlanHistory, MealHistory,\
EventIngredient
from plan_calendar.serializers import UserPlanHistorySerializer,\
UserPlnHistorySerializer, MealHistorySerializer, MealHistoryWriteSerializer,\
EventIngredientSerializer, EventIngSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import permissions, viewsets, generics, status
from authentication.permissions import IsFollowing
from django.core import serializers
import hashlib, datetime, random
from rest_framework import status
import traceback
import logging

class FollowDietViewSet(viewsets.ModelViewSet):
	'''view to allow users to follow plans'''
	queryset = UserPlanHistory.objects.all()
	serializer_class = UserPlanHistorySerializer

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
			obj = UserPlanHistory.objects.create(user=request.user,
		                              **serializer.validated_data)
			return Response({'userplanhistory_id':obj.id},
		                status=status.HTTP_201_CREATED)
		else:
			print serializer.errors
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MealHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    '''view to allow users to follow plans'''
    serializer_class = MealHistorySerializer
    
    def get_queryset(self):
        '''returns queryset for get method'''
        if self.request.query_params['date']:
            date = self.request.GET.get('date')
            return MealHistory.objects.filter(date=date)
        else:
            # TODO: the response code might be incorrect. fix it later
            return Response({'message':'no results found'}, status=status.HTTP_200_OK)

	def get_permissions(self):
		'''return allowed permissions'''
		if self.request.method in permissions.SAFE_METHODS:
			return (permissions.IsAuthenticated(), )

class IngredientViewSet(viewsets.ModelViewSet):
    '''view to allow users to follow plans'''
    serializer_class = EventIngredientSerializer
    queryset = EventIngredient.objects.all()
    
    #TODO: below function is not correct. allow only plan follower
    # to edit stuff
    def get_permissions(self):
		'''return allowed permissions'''
		if self.request.method in permissions.SAFE_METHODS:
			self.serializer_class = EventIngredientSerializer
			return (permissions.IsAuthenticated(), )
		if self.request.method in ['POST', 'PATCH']:
			self.serializer_class = EventIngSerializer
			return (permissions.IsAuthenticated(), )

    