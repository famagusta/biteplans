'''serializes db queries into python objs for easy json conversions'''
from rest_framework import serializers
from authentication.models import Account, AccountDetail
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from schedule.models import Calendar


class AccountSerializer(serializers.ModelSerializer):
    '''serializer for auth users'''
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        '''Meta Data'''
        model = Account
        fields = ('id', 'email', 'username', 'date_joined', 'last_login',
                  'updated_at', 'password', 'confirm_password',)
        read_only_fields = ('date_joined', 'updated_at',)

    def create(self, validated_data):
        '''runs when new user is created'''
        return Account.objects.create(**validated_data)

    def update(self, instance, validated_data):
        '''This method overrides update method,
        and takes care of update on details of a user'''
        instance.username = validated_data.get(
            'username', instance.username)
        instance.save()

        return instance


class AccountDetailSerializer(serializers.ModelSerializer):
    '''serializer for account details of a user - to be filled
       post sign up'''
    class Meta:
        model = AccountDetail
        fields = ('__all__')
