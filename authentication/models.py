from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager

class AccountManager(BaseUserManager):
    '''this class manages the user save method and other user actions'''
    def create_user(self, email, password=None, **kwargs):
        '''creates normal user'''
        if not email:
            raise ValueError('Users must have a valid email.')

        if not kwargs.get('username'):
            raise ValueError('Users must have a valid username.')

        account = self.model(email=self.normalize_email(email),
                             username=kwargs.get('username')
                             )

        account.set_password(password)
        account.save()

        return account

    def create_superuser(self, email, password, **kwargs):
        '''creates superuser'''
        account = self.create_user(email, password, **kwargs)

        account.is_admin = True
        account.save()

        return account


class Account(AbstractBaseUser):
    '''Abstracts/overrides the default user model'''
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100, unique=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    objects = AccountManager()

    USERNAME_FIELD = 'username'

    REQUIRED_FIELDS = ['email']
    @property
    def is_superuser(self):
        '''check if superuser'''
        return self.is_admin

    @property
    def is_staff(self):
        '''check if employee'''
        return self.is_admin


    def has_perm(self, perm, obj=None):
        '''check permissions'''
        return self.is_admin

    def has_module_perms(self, app_label):
        '''check permissions'''
        return self.is_admin



    def __unicode__(self):
        return self.username


    def get_name(self):
        '''return username'''
        return self.username

    def get_short_name(self):
        '''return username'''
        return self.username
