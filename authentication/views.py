'''views for auth apis'''
from rest_framework_jwt.settings import api_settings
from datetime import datetime
from authentication.serializers import AccountSerializer
from rest_framework import permissions, viewsets
from authentication.models import Account
from authentication.permissions import IsAccountOwner
from rest_framework.response import Response
from rest_framework import status


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
        the details entered by the user. If the details are valid new user is created
        and assigned a token which would later be decoded to authenticate the user'''
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            account = Account.objects.create_user(**serializer.validated_data)
            token = create_token(account)['token']
            return_dict = serializer.data
            return_dict['token']=token
            return Response(return_dict)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)
