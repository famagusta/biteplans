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
                       url(r'^api/v1/jwt_user/',
                           views.UserJWTDetailView.as_view()),
                       url(r'^sociallogin/',
                           include('rest_social_auth.urls_jwt')),
                       url(r'^registerConfirm/(?P<activation_key>\w+)/',
                           views.register_confirm),
                       url(r'^loginstatus/$', views.checkAccountStatus),
                       url(r'^forgot/', include('djoser.urls.base')),
                      # url(r'^accountDetail/', views.accountDetails),
                       )
