'''URLs for bitespace_app'''

from django.conf.urls import patterns, url
from bitespace_app import views

urlpatterns = patterns('',
                       url(r'^search/$', views.GlobalSearchList.as_view(),
                           name="search"),
					)
