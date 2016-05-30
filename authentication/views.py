'''views for auth apis'''
from rest_framework_jwt.settings import api_settings
from datetime import datetime
from authentication.serializers import AccountSerializer
from rest_framework import permissions, viewsets, generics, status
from authentication.models import Account
from authentication.permissions import IsAccountOwner
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
import hashlib
import datetime
import random
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, get_user_model, login
from rest_social_auth.serializers import UserSerializer
from rest_social_auth.views import JWTAuthMixin
from rest_framework.parsers import MultiPartParser, FormParser


# Create your views here.
master = settings.EMAIL_HOST_USER

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


def create_token(user):
    '''create jwt token for new user'''
    payload = jwt_payload_handler(user)
    if api_settings.JWT_ALLOW_REFRESH:
        payload['orig_iat'] = timegm(
            datetime.utcnow().utctimetuple())
    return {
        'token': jwt_encode_handler(payload),
    }


class AccountViewSet(viewsets.ModelViewSet):
    '''registration view'''
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

            # unable to break the below line due to server error
            message = 'Hey %s, Howdy! Thanks for signing up! Here is your activation link, valid for just 2 days, http://biteplans.com/confirm/%s' % (request.data['username'], activation_key)
            tr = send_mail(sub, message, master, [email], fail_silently=False)
            if tr:
                account = Account.objects.create_user(
                    **serializer.validated_data)
                account.activation_key = activation_key
                account.key_expires = key_expires
                account.is_active = False
                account.save()
                return Response({'success': 'Account created'},
                                status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid email, does not exist'},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data, email'
                       + 'or username already exists.'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', ])
def register_confirm(request, activation_key):
    # check if user is already
    # logged in and if he is redirect him
    # to some other url, e.g. home
    if request.user.is_authenticated():
        return Response({'error': 'Not authorized, as this user has already'
                         + 'been verified'})

    # check if the activation key has expired,
    # if it hase then render confirm_expired.html
    else:
        user_profile = get_object_or_404(Account,
                                         activation_key=activation_key)
        if user_profile.key_expires < timezone.now():
            return Response({'error': 'Activation key has expired'})
        # if the key hasn't expired
        # save user and set him as active and
        # render some template to confirm activation
        user_profile.is_active = True

        user_profile.backend = 'django.contrib.auth.backends.ModelBackend'
        user_profile.save()
        login(request, user_profile)
        token = create_token(user_profile)['token']
        return Response({'success': 'Account has been confirmed',
                        'token': token})


class BaseDetailView(generics.RetrieveAPIView):
    '''Base details of user'''
    permission_classes = permissions.IsAuthenticated,
    serializer_class = UserSerializer
    model = get_user_model()

    def get_object(self, queryset=None):
        '''return current object'''
        return self.request.user


class UserJWTDetailView(JWTAuthMixin, BaseDetailView):
    pass


@api_view(['GET'])
def checkAccountStatus(request):
    '''function to check auth status of a user'''
    if request.method == 'GET':
        if request.user.is_authenticated():
            data = {'status': True,
                    'pk': request.user.id}
            return Response(data, status=status.HTTP_200_OK)
        else:
            data = {'status': False}
            return Response(data, status=status.HTTP_200_OK)
    else:
        data = {'error': 'Method not allowed'}
        Response(data, status=status.HTTP_405_METHOD_NOT_ALLOWED)
