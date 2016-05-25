'''URLs for the webapp apis'''

from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from ingredients import views

urlpatterns = patterns('',
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^authentication/',
                           include('authentication.urls', namespace="auth")),
                       url(r'^ingredients/',
                           include('ingredients.urls',
                                   namespace="ingredients")),
                       url(r'^dietplans/',
                           include('dietplans.urls',
                                   namespace="dietplans")),
                       url(r'^recipes/',
                           include('recipes.urls',
                                   namespace="recipes")),
                       url(r'^user-calendar/',
                           include('plan_calendar.urls',
                                   namespace="plan_calendar")),
                       url(r'^search/$', views.GlobalSearchList.as_view(),
                           name="search"),
                       url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
                            'document_root': settings.MEDIA_ROOT}),
                       url('^.*$',
                           TemplateView.as_view(template_name="index.html"),
                           name='index'),
                       ) 

if not settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT
                          )

if settings.DEBUG:
    urlpatterns += patterns(
        'django.views.static',
        (r'^media/(?P<path>.*)',
            'serve',
            {'document_root': settings.MEDIA_ROOT}),
    )
