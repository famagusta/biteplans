'''wsgi config file for mod_wsgi based deployment on apache server on 
   ubuntu 14.04'''

import os
import time
import traceback
import signal
import sys
import site

# Add the site-packages of the chosen virtualenv to work with
site.addsitedir('/home/ubuntu/biteplans/venv/local/lib/python2.7/site-packages')

# Add the app's directory to the PYTHONPATH
sys.path.append('/home/ubuntu/biteplans')

os.environ['DJANGO_SETTINGS_MODULE'] = 'bitespace_project_config.settings'

# Activate your virtual env
activate_env=os.path.expanduser("/home/ubuntu/biteplans/venv/bin/activate_this.py")
execfile(activate_env, dict(__file__=activate_env))

from django.core.wsgi import get_wsgi_application
# _application = get_wsgi_application() 

def application(environ, start_response):
    os.environ['SOCIAL_AUTH_FACEBOOK_KEY']=environ.get('SOCIAL_AUTH_FACEBOOK_KEY','')
    os.environ['SOCIAL_AUTH_FACEBOOK_SECRET']=environ.get('SOCIAL_AUTH_FACEBOOK_SECRET','')
    os.environ['SOCIAL_AUTH_GOOGLE_OAUTH2_KEY']=environ.get('SOCIAL_AUTH_GOOGLE_OAUTH2_KEY','')
    os.environ['SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET']=environ.get('SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET','')
    os.environ['SECRET_KEY']=environ.get('SECRET_KEY','')
    os.environ['BITEPLANS_DB_NAME']=environ.get('BITEPLANS_DB_NAME','')
    os.environ['BITEPLANS_SECRET_KEY']=environ.get('BITEPLANS_SECRET_KEY','')
    os.environ['BITEPLANS_DB_ROOT_USER']=environ.get('BITEPLANS_DB_ROOT_USER','')
    os.environ['BITEPLANS_DB_ROOT_USER_PWD']=environ.get('BITEPLANS_DB_ROOT_USER_PWD','')
    
    # below code is to avoid getting some random errror RuntimeError: populate() isn't reentrant
    try:
        app = get_wsgi_application()(environ, start_response)
        return app
    except Exception:
        print 'handling WSGI Exception'
        if 'mod_wsgi' in sys.modules:
            traceback.print_exc()
            os.kill(os.getpid(), signal.SIGINT)
            time.sleep(2.5)
