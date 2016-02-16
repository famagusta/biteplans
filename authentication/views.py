'''views for auth apis'''
from rest_framework_jwt.settings import api_settings
from datetime import datetime
from authentication.serializers import AccountSerializer
from rest_framework import permissions, viewsets
from authentication.models import Account, UserProfile
from authentication.permissions import IsAccountOwner
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from social.apps.django_app.utils import load_strategy, psa
from social.apps.django_app.views import _do_login
import hashlib,datetime,random
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.shortcuts import get_object_or_404
master = settings.EMAIL_HOST_USER
from django.contrib.auth import authenticate

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
            salt = hashlib.sha1(
                                str(random.random()).encode('utf8')
                                ).hexdigest()[:5]
            email = serializer.data['email']
            activation_key = hashlib.sha1(salt+email).hexdigest()
            key_expires = datetime.datetime.today() + datetime.timedelta(200)
            sub = "Account confirm"
            message = 'Hey %s, Howdy! Thanks for signing up! Here is your activation link, valid for just 2 days, http://bitespacetest.com:8000/confirm' % (request.data['username'])
            tr = send_mail(sub, message, master, [email], fail_silently=False)
            if tr:
                account = Account.objects.create_user(
                                            **serializer.validated_data
                                            )
                new_profile = UserProfile(user=account,
                                      activation_key=activation_key,
                                      key_expires=key_expires)
                new_profile.save()
                authenticate(email=email,username=request.data['username'],password=request.data['password'])
                token = create_token(account)['token']
                return_dict = serializer.data
                return_dict['token'] = token
                return Response(return_dict)
            else:
                return Response({'error':'Invalid email, does not exist'},
                                status=status.HTTP_400_BAD_REQUEST)


        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data, email or username already exists.'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', ])
def register_confirm(request):
    #check if user is already
    ##logged in and if he is redirect him
    ##to some other url, e.g. home
    if request.user.is_authenticated():
        user_profile = get_object_or_404(UserProfile,
                                         user=request.user)

    #check if the activation key has expired,
    ##if it hase then render confirm_expired.html
        if user_profile.key_expires < timezone.now():
            return Response({'error':'Activation key has expired'})
        #if the key hasn't expired
        #save user and set him as active and
        #render some template to confirm activation
        user_profile.is_active = True
        user_profile.save()
        return Response({'success:Account has been confirmed'})

    else:
        return Response({'error':'Not authorized'})
@psa()
def auth_by_token(request, backend):
    '''auth flow using fb token'''
    print request.POST.get('access_token')
    user = request.user
    user = user.is_authenticated() and user or None
    print user, "USERNAME TRYTRY"
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
    print request.POST.get('access_token', None)
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

