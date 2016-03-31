'''URLs for bitespace_app'''

from django.conf.urls import patterns, url, include
from rest_framework import routers
from ingredients import views
from dietplans import views as vu

router = routers.SimpleRouter()
router.register(r'dietPlans',
                vu.DietPlanViewset)

urlpatterns = patterns('',
                       url(r'^search/$', views.GlobalSearchList.as_view(),
                           name="search"),
                       url(r'^diet/', include(router.urls)),
					)
