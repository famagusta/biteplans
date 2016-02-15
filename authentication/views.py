'''views for auth apis'''
from rest_framework_jwt.settings import api_settings
from datetime import datetime
from authentication.serializers import AccountSerializer
from rest_framework import permissions, viewsets
from authentication.models import Account
from authentication.permissions import IsAccountOwner
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from social.apps.django_app.utils import load_strategy,psa
from social.apps.django_app.views import _do_login
from django.contrib.auth import login

# Create your views here.
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

def create_token(user):
    '''create jwt token for new user'''
    payload = jwt_payload_handler(user)
    if api_settings.JWT_ALLOW_REFRESH:
        payload['orig_iat'] = timegm(
		                             datetime.utcnow().utctimetuple()
		                             )
    return {
	'token': jwt_encode_handler(payload),
	}

class AccountViewSet(viewsets.ModelViewSet):
    '''registration view'''
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        '''return allowed permissions'''
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(), IsAccountOwner(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(),)

    def create(self, request):
        '''create new user, create a userSerializer based on
        the details entered by the user. If the details are
        valid new user is created and assigned a token which
        would later be decoded to authenticate the user'''
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            account = Account.objects.create_user(**serializer.validated_data)
            token = create_token(account)['token']
            return_dict = serializer.data
            return_dict['token'] = token
            return Response(return_dict)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)


@psa()
def auth_by_token(request, backend):
    '''auth flow using fb token'''
    print request.POST.get('access_token')
    backend = request.backend
    user = request.user
    user=user.is_authenticated() and user or None
    print user,"USERNAME TRYTRY"
    user = request.backend.do_auth(
        request.POST.get('access_token'),
        user=user.is_authenticated() and user or None
        )
    if user and user.is_active:
        return user# Return anything that makes sense here
    else:
        return None

@api_view(['POST'])
@permission_classes((permissions.AllowAny,))
def social_register(request):
    '''signup using fb'''
    print request.POST.get('access_token',None)
    print "TRYTRYTRY"
    auth_token = request.POST.get('access_token', None)
    backend = request.POST.get('backend', None)
    if auth_token and backend:
        try:
            print "DX DJANGO"
            user = auth_by_token(request, backend)
        except Exception, err:
            return Response(str(err), status=400)
        if user:
            strat = load_strategy(request=request, backend=backend)
            _do_login(strat, user)
            return Response("User logged in", status=status.HTTP_200_OK)
        else:
            return Response("Bad Credentials", status=403)
    else:
        return Response("Bad request", status=400)

@psa('social:complete')
def social_cxcxcxcregister(request, backend):
    # This view expects an access_token GET parameter, if it's needed,
    # request.backend and request.strategy will be loaded with the current
    # backend and strategy.
    token = request.POST.get('access_token')
    user = request.backend.do_auth(request.POST.get('access_token'))
    print "jksljlkja"
    if user:
        login(request, user)
        return 'OK'
    else:
        return 'ERROR'
