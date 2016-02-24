'''models = sql tables for user details'''
from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.models import BaseUserManager


class AccountManager(BaseUserManager):
    '''this class manages the user save method and other user actions'''
    def create_user(self, username, email, password=None, **kwargs):
        '''creates normal user'''
        kwargs.setdefault('is_staff', False)
        kwargs.setdefault('is_superuser', False)

        if not username:
            raise ValueError('Users must have a valid username.')

        if not email:
            email = username+'@'+'facebook.com'

        account = self.model(email=self.normalize_email(email),
                             username=username
                             )

        account.set_password(password)
        account.save()

        return account

    def create_superuser(self, username, email, password, **kwargs):
        '''creates superuser'''
        kwargs.setdefault('is_staff', True)
        kwargs.setdefault('is_superuser', True)

        if kwargs.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if kwargs.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, email, password, **kwargs)


class Account(AbstractBaseUser, PermissionsMixin):
    '''Abstracts/overrides the default user model'''
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    social_thumb = models.URLField(null=True, blank=True)
    objects = AccountManager()
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __unicode__(self):
        return self.username


    def get_full_name(self):
        '''return username'''
        return self.username

    def get_short_name(self):
        '''return username'''
        return self.username

class UserProfile(models.Model):
    '''model for user's profile'''
    user = models.OneToOneField(Account)
    activation_key = models.CharField(max_length=40, blank=True)
    key_expires = models.DateTimeField()
    def __str__(self):
        return self.user.username
