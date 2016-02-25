"""
Django settings for bitespace project.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import datetime
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '2o8wd)y-(8^()lkxcs1ejp0uafugdg&%0ds=nat&@-*j9$n1im'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []

TEMPLATE_PATH = os.path.join(BASE_DIR, 'templates')

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates"
    # or "C:/www/django/templates".
    # Always use forward slashes, even on windows.
    # Don't forget to use absolute paths, not relative paths.
    TEMPLATE_PATH,
)

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sites',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'bitespace_app',
    'authentication',
    'rest_framework',
    'markdown',
    'rest_framework.authtoken',
    'django_filters',
    'import_export',
    'social.apps.django_app.default',
    'rest_social_auth',
)
SOCIAL_AUTH_ADMIN_USER_SEARCH_FIELDS = ['username', 'first_name', 'email']

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ('rest_framework.filters.DjangoFilterBackend',),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',

    ],
     'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    )
}
SOCIAL_AUTH_PIPELINE = (
 'authentication.social_pipe.auto_logout',
 'social.pipeline.social_auth.social_details',
 'social.pipeline.social_auth.social_uid',
 'social.pipeline.social_auth.auth_allowed',
 'social.pipeline.social_auth.social_user',
 'social.pipeline.user.get_username',
 'social.pipeline.social_auth.associate_by_email',
 'social.pipeline.user.create_user',
 'social.pipeline.social_auth.associate_user',
 'social.pipeline.social_auth.load_extra_data',
 'social.pipeline.user.user_details',
 'authentication.social_pipe.save_avatar',  # custom action
)
JWT_AUTH = {
    'JWT_EXPIRATION_DELTA': datetime.timedelta(days=30),
    'JWT_AUTH_HEADER_PREFIX': 'JWT',
}

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.template.context_processors.debug',
    'django.template.context_processors.i18n',
    'django.template.context_processors.media',
    'django.template.context_processors.static',
    'django.template.context_processors.tz',
    'django.contrib.messages.context_processors.messages',
    'social.apps.django_app.context_processors.backends',
    'social.apps.django_app.context_processors.login_redirect',
)

AUTHENTICATION_BACKENDS = (
    'social.backends.facebook.FacebookOAuth2',
    'social.backends.facebook.FacebookAppOAuth2',
    'social.backends.google.GoogleOAuth2',
    'social.backends.twitter.TwitterOAuth',
    'django.contrib.auth.backends.ModelBackend',
)

SOCIAL_AUTH_FACEBOOK_KEY = "778572508914532"
SOCIAL_AUTH_FACEBOOK_SECRET = "59edc4201f5b848127d52b1fc736393a"
SOCIAL_AUTH_FACEBOOK_SCOPE = ['email']
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {
  'locale': 'ru_RU',
  'fields': 'id, name, email, age_range'
}

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '625705095605-6lemikvbb7kdh13lf3puq0r1fvcs0ukh.apps.googleusercontent.com'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = 'IiMLDstpkQmtaeMqCS8dN6qy'

# SOCIAL_AUTH_GOOGLE_OAUTH2_USE_DEPRECATED_API = True
# SOCIAL_AUTH_GOOGLE_PLUS_USE_DEPRECATED_API = True

REGISTRATION_OPEN = True    # If True, users can register
ACCOUNT_ACTIVATION_DAYS = 7  # One-week activation window
REGISTRATION_AUTO_LOGIN = True   # If True, users be automatically logged in.
# LOGIN_REDIRECT_URL = '/bitespace/'  # The page you want users to arrive at
# # after they suceffully log in
# LOGIN_URL = '/accounts/login/'  # The page users are directed to if they are
# # not logged in, and are trying to access pages that require login

AUTH_USER_MODEL = 'authentication.Account'

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'bitespace_project_config.urls'

WSGI_APPLICATION = 'bitespace_project_config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'DB_BITEAPP',
        'USER': 'shubham',
        'PASSWORD': 'jx1234',
        'HOST': 'localhost',   # Or an IP Address that your DB is hosted on
        'PORT': '3306',
    }
}
# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/
STATIC_PATH = os.path.join(BASE_DIR, 'static')

STATIC_URL = '/static/'

STATIC_ROOT = 'staticfiles'

STATICFILES_DIRS = (
    STATIC_PATH,
)

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
# Absolute path to the media directory

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# use bcrypt if you want more secure hasher
PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'shubham@jeevomics.com'
EMAIL_HOST_PASSWORD = 'vniamvcbgpfsdhsf'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'shubham@jeevomics.com'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'rest_social_auth': {
            'handlers': ['console', ],
            'level': "DEBUG",
        },
    }
}
