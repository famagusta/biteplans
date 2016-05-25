'''URLs for bitespace_app'''
from django.conf.urls import patterns, url, include
from rest_framework import routers
from . import views


urlpatterns = patterns('',
                       url(r'^ingredient/(?P<ingredient>[0-9]+)/$',
                           views.GetCompleteIngredientInfo.as_view()),
                       )
