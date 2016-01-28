from django.shortcuts import render, render_to_response
from django.template.context import RequestContext
# from bitespace_app.forms import UserForm, UserProfileForm
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import login_required
from datetime import datetime
from bitespace_app.models import USDAIngredient

# Create your views here.

def get_ingredients(request):
    context = {'ingredients' : USDAIngredient.objects.order_by('-id')}
    print context
    return render(request, 'bitespace/ingredients.html', context)

@login_required
def index(request):
    # This will be the homepage in future

    # Construct a dictionary to pass to the template engine as its context.
    context_dict = {'boldmessage': "Bitespace says welcome!"}

    context = RequestContext(request,
                             {'request': request,
                              'user': request.user})
    return render(request, 'bitespace/index.html', context_dict,
                  context_instance=context)


def create_plan(request):
    return render(request, 'bitespace/create_plan.html')
