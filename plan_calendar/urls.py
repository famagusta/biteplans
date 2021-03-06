'''URLs for plan_calendar'''
from rest_framework import routers
from django.conf.urls import patterns, url, include
from plan_calendar import views as calendarViews

calendarRouter = routers.SimpleRouter()
calendarRouter = routers.SimpleRouter()
calendarRouter.register(r'follow', calendarViews.FollowDietViewSet,
                      base_name="calendar")

calendarRouter.register(r'get-plan-summary', calendarViews.MealHistoryViewSet,
                      base_name="date")
calendarRouter.register(r'event-ingredients', calendarViews.EventIngredientsViewSet)
calendarRouter.register(r'event-recipes', calendarViews.EventRecipesViewSet)

calendarRouter.register(r'my-ingredients', calendarViews.MyIngredientsViewset)
calendarRouter.register(r'my-recipes', calendarViews.MyRecipeViewset)
calendarRouter.register(r'my-dietplans', calendarViews.MyPlanViewset)

urlpatterns = patterns('',
                       url(r'my-ingredient-search/$',
                           calendarViews.MyIngredientSearchViewset.as_view()),
                       url(r'my-recipe-search/$',
                           calendarViews.MyRecipeSearchViewset.as_view()),
                       )

urlpatterns += calendarRouter.urls