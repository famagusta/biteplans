"""
Django Development settings for bitespace project.

For more information on this file, see
https://code.djangoproject.com/wiki/SplitSettings
"""


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import datetime
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True 

TEMPLATE_DEBUG = True 

ALLOWED_HOSTS = []

TEMPLATE_PATH = os.path.join(BASE_DIR, 'templates')
