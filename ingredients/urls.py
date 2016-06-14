'''URLs for bitespace_app'''
from django.conf.urls import patterns, url, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
#router.register("ingredient/search", views.SearchView.as_view())


urlpatterns = patterns('',
                       url(r'^ingredient/(?P<ingredient>[0-9]+)/$',
                           views.GetCompleteIngredientInfo.as_view()),
#                       url(r"/api/v1/", include(router.urls)),
                        url(r'search/', views.SearchView.as_view())
                       )
