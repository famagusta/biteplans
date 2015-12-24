from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = patterns('',
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^bitespace/', include('bitespace_app.urls')),
                       url(r'^accounts/',
                           include('registration.backends.simple.urls')),
                       url('', include('social.apps.django_app.urls',
                                       namespace='social')),
                       url('', include('django.contrib.auth.urls',
                                       namespace='auth')),
                       )

if not settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    urlpatterns += patterns(
        'django.views.static',
        (r'^media/(?P<path>.*)',
            'serve',
            {'document_root': settings.MEDIA_ROOT}),
    )
