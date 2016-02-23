'''URLs for bitespace_app'''

from django.conf.urls import patterns, url
from bitespace_app import views

urlpatterns = patterns('',
                       url(r'^search', views.GlobalSearchList.as_view(),
                           name="search"),
                       url(r'^recipe_search', views.RecipeSearchList.as_view(),
                           name="recipe_search"),
                       url(r'^profile', views.AccountDetail .as_view(),
                           name="profile"),
					)
