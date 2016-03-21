'''URLs for the webapp apis'''

from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView


urlpatterns = patterns('',
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^bitespace/',
                           include('bitespace_app.urls',
                                   namespace="bitespace")),
                       url(r'^authentication/',
                           include('authentication.urls', namespace="auuth")),
                       url('^.*$',
                           TemplateView.as_view(template_name="index.html"),
                           name='index'),
                       url(r'^fullcalendar/', TemplateView.
                           as_view(template_name='fullcalendar.html'),
                           name='fullcalendar'),
                       url(r'^schedule/', include('schedule.urls')),
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
