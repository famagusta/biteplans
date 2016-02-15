'''URLs for authentication'''
from rest_framework import routers
from django.conf.urls import patterns, url, include
from authentication import views

router = routers.SimpleRouter()
router.register(r'register',
                views.AccountViewSet)

urlpatterns = patterns('',
                       url(r'^api/v1/', include(router.urls)),
                       url(r'^api/v1/login',
                           'rest_framework_jwt.views.obtain_jwt_token'),
                       url(r'^sociallogin/', views.social_register),

					)
