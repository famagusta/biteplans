'''URLs for recipes'''
from rest_framework import routers
from django.conf.urls import patterns, url, include
from recipes import views as recipeViews

recipeRouter = routers.SimpleRouter()
recipeRouter.register(r'recipe', recipeViews.RecipeViewSet)
recipeRouter.register(r'recipe-ingredient', recipeViews.RecipeIngredientViewSet)
recipeRouter.register(r'recipe-rating', recipeViews.RecipeRatingViewSet)

urlpatterns = patterns('',
                       #url(r'^$', include(recipeRouter.urls)),
                       url(r'recipe-nutrition/(?P<recipe>[0-9]+)/$',
                            recipeViews.GetCompleteRecipeInfo.as_view()),
                       )

urlpatterns += recipeRouter.urls