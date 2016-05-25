'''URLs for dietplans'''
from rest_framework import routers
from django.conf.urls import patterns, url, include
from dietplans import views as dietplanViews

dietPlanRouter = routers.SimpleRouter()
dietPlanRouter.register(r'dietplan',
                dietplanViews.DietPlanViewset)
dietPlanRouter.register(r'mealplan',
                dietplanViews.MealPlanViewSet)
dietPlanRouter.register(r'mealing',
                dietplanViews.MealIngredientViewSet)
dietPlanRouter.register(r'mealrecipe',
                dietplanViews.MealRecipeViewSet)
dietPlanRouter.register(r'planRating',
                dietplanViews.PlanRatingViewSet)

urlpatterns = patterns('',
                       #url(r'^$', include(dietPlanRouter.urls)),
                       url(r'^copy-day-plan/', dietplanViews.CopyViewSet.as_view()),
                       url(r'^plan/dayplan/(?P<diet>[0-9]+)/(?P<day_no>[0-9]+)/(?P<week_no>[0-9]+)/$',
                           dietplanViews.DayPlnViewSet.as_view()),
                       )

urlpatterns += dietPlanRouter.urls