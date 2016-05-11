'''URLs for bitespace_app'''
from django.conf.urls import patterns, url, include
from rest_framework import routers
from . import views
from dietplans import views as vu
from recipes import views as recipeView
from plan_calendar import views as plnView


router = routers.SimpleRouter()
router.register(r'dietplans',
                vu.DietPlanViewset)
router.register(r'mealplans',
                vu.MealPlanViewSet)
router.register(r'mealing',
                vu.MealIngredientViewSet)
router.register(r'mealrecipe',
                vu.MealRecipeViewSet)

reciperouter = routers.SimpleRouter()
reciperouter.register(r'recipes', recipeView.RecipeViewSet)
reciperouter.register(r'recipeingredient', recipeView.RecipeIngredientViewSet)

followrouter = routers.SimpleRouter()
followrouter.register(r'follow', plnView.FollowDietViewSet)
followrouter.register(r'getPlanSummary', plnView.MealHistoryViewSet,
                      base_name="date")
followrouter.register(r'myingredients', plnView.MyIngredientsViewset)
followrouter.register(r'myrecipes', plnView.MyRecipeViewset)

urlpatterns = patterns('',
                       url(r'^search/$', views.GlobalSearchList.as_view(),
                           name="search"),
                       url(r'^ingredient/(?P<ingredient>[0-9]+)/$',
                           views.GetCompleteIngredientInfo.as_view()),
                       url(r'^diet/', include(router.urls)),

                       url(r'^recipe/', include(reciperouter.urls)),

                       url(r'^calendar/', include(followrouter.urls)),

                       url(r'^plan/dayplan/(?P<diet>[0-9]+)/(?P<day_no>[0-9]+)/(?P<week_no>[0-9]+)/$',
                           vu.DayPlnViewSet.as_view()),
					)
