'''models = sql tables for user details'''
from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.models import BaseUserManager
from schedule.models import Calendar
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver


class AccountManager(BaseUserManager):
    '''this class manages the user save method and other user actions'''
    def create_user(self, username, email,
                    password=None, **kwargs):
        '''creates normal user'''
        if not username:
            raise ValueError('Users must have a valid username.')

        if not email:
            email = username+'@'+'facebook.com'

        account = self.model(email=self.normalize_email(email),
                             username=username)

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
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    social_thumb = models.URLField(null=True, blank=True)

    # Added calendar support
    calendar = models.OneToOneField(Calendar, on_delete=models.CASCADE,
                                    null=True)

    # These fields will be required for manually signing
    # up(ie not google or fb user)
    # We will send an email to the user on signing up
    # clicking on which will make him
    # active and if he does not click on it then he will be inactive

    activation_key = models.CharField(max_length=40, null=True)
    key_expires = models.DateTimeField(null=True)

    objects = AccountManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __unicode__(self):
        return self.email

    def get_full_name(self):
        '''return username'''
        return self.username

    def get_short_name(self):
        '''return username'''
        return self.username


@receiver(pre_save, sender=Account)
def assosiate_calendar(sender, instance, **kwargs):
    '''assosiate one to one calender to the user instance'''
    if instance.pk==None:
        print instance
        cal = Calendar.objects.create(name=instance.username,
                                              slug='default')
        instance.calendar = cal
