"""
Django settings for bitespace project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
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
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'bitespace_app',
    'registration',
    'social.apps.django_app.default',
    'csvimport.app.CSVImportConf',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.core.context_processors.tz',
    'django.contrib.messages.context_processors.messages',
    'social.apps.django_app.context_processors.backends',
    'social.apps.django_app.context_processors.login_redirect',
)

AUTHENTICATION_BACKENDS = (
    'social.backends.facebook.FacebookOAuth2',
    'social.backends.google.GoogleOAuth2',
    'social.backends.twitter.TwitterOAuth',
    'django.contrib.auth.backends.ModelBackend',
)

SOCIAL_AUTH_FACEBOOK_KEY = "778572508914532"
SOCIAL_AUTH_FACEBOOK_SECRET = "46a3f1c1d626e5296d4f17ac4f3ea1a2"

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY =\
    "625705095605-qj6ve872tlinvt14tmnfn38kn3rsbclg.apps.googleusercontent.com"
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = "y7LJfV8ws-ZqAT0dK_kxz5JF"

# SOCIAL_AUTH_GOOGLE_OAUTH2_USE_DEPRECATED_API = True
# SOCIAL_AUTH_GOOGLE_PLUS_USE_DEPRECATED_API = True

REGISTRATION_OPEN = True    # If True, users can register
ACCOUNT_ACTIVATION_DAYS = 7  # One-week activation window
REGISTRATION_AUTO_LOGIN = True   # If True, users be automatically logged in.
LOGIN_REDIRECT_URL = '/bitespace/'  # The page you want users to arrive at
# after they suceffully log in
LOGIN_URL = '/accounts/login/'  # The page users are directed to if they are
# not logged in, and are trying to access pages that require login

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
        'NAME': 'DB_BITEPLAN',
        'USER': 'DB_ROBIN',
        'PASSWORD': 'jx1234',
        'HOST': 'localhost',   # Or an IP Address that your DB is hosted on
        'PORT': '3306',
        'OPTIONS': {
	    'init_command': 'SET storage_engine=INNODB',
        },
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

STATICFILES_DIRS = (
    STATIC_PATH,
)

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
# Absolute path to the media directory


# use bcrypt if you want more secure hasher
PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
)
