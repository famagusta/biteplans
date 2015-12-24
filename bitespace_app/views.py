from django.shortcuts import render, render_to_response
from django.template.context import RequestContext
# from bitespace_app.forms import UserForm, UserProfileForm
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import login_required
from datetime import datetime


# Create your views here.
@login_required
def index(request):
    # This will be the homepage in future

    # Construct a dictionary to pass to the template engine as its context.
    context_dict = {'boldmessage': "Bitespace says welcome!"}
    
    context = RequestContext(request, 
                            {'request': request, 
                             'user': request.user})
    return render(request, 'bitespace/index.html', context_dict, context_instance=context)
