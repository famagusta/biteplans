'''models = sql tables for user details'''
from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.models import BaseUserManager
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from datetime import date
import decimal


def calculate_age(born):
    today = date.today()
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day))

#from user_profile.models import UserPhysicalHistory
_UNSAVED_FILEFIELD = 'unsaved_filefield'


GENDER_CHOICES = (
    ('M', 'Male'),
    ('F', 'Female'),
)

ACTIVITY_LEVEL_CHOICE = (
    ('S', 'Sedentary'),
    ('MA', 'Mild Activity'),
    ('OA', 'Moderate Activity'),
    ('HA', 'Heavy Activity'),
    ('VHA', 'Very Heavy Activity'),
)

def upload_to(instance, filename):
    return 'photos/user_profile_image/{}_{}'.format(instance.id, filename)


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
                             username=username, **kwargs)
        
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

    # These fields will be required for manually signing
    # up(ie not google or fb user)
    # We will send an email to the user on signing up
    # clicking on which will make him
    # active and if he does not click on it then he will be inactive
    image_path = models.ImageField(null=True, blank=True, upload_to=upload_to)
    activation_key = models.CharField(max_length=40, null=True)
    key_expires = models.DateTimeField(null=True)

    # these are not mandatory fields
    weight = models.DecimalField(null=True, blank=True,
                                 max_digits=11, decimal_places=3)
    height = models.DecimalField(null=True, blank=True,
                                 max_digits=11, decimal_places=3)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(null=True, blank=True,
                              max_length=1, choices=GENDER_CHOICES)
    activity_level = models.CharField(null=True, blank=True,
                                      max_length=3, choices=ACTIVITY_LEVEL_CHOICE)

    # some optional fields - body measurements
    body_fat_percent = models.DecimalField(null=True, blank=True,
                                           max_digits=11, decimal_places=3)
    neck = models.DecimalField(null=True, blank=True,
                               max_digits=11, decimal_places=3)
    shoulder = models.DecimalField(null=True, blank=True,
                                   max_digits=11, decimal_places=3)
    bicep = models.DecimalField(null=True, blank=True,
                                max_digits=11, decimal_places=3)
    forearm = models.DecimalField(null=True, blank=True,
                                  max_digits=11, decimal_places=3)
    chest = models.DecimalField(null=True, blank=True,
                                max_digits=11, decimal_places=3)
    waist = models.DecimalField(null=True, blank=True,
                                max_digits=11, decimal_places=3)
    hip = models.DecimalField(null=True, blank=True,
                              max_digits=11, decimal_places=3)
    thigh = models.DecimalField(null=True, blank=True,
                                max_digits=11, decimal_places=3)
    calf = models.DecimalField(null=True, blank=True,
                               max_digits=11, decimal_places=3)

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
    
    @property
    def is_basic_info(self):
        if self.weight and self.height and self.date_of_birth \
            and self.gender and self.activity_level:
                return True
        return False
    
    @property
    def basal_metabolic_rate(self):
        # this is based on mifflin st jeor equation - see wikipedia
        age = calculate_age(self.date_of_birth)
        bmr = 0
        gender_factor = decimal.Decimal(5)
        if self.gender == 'F':
            gender_factor = decimal.Decimal(-161)
        if self.weight and self.height and age and self.gender:
            weight_factor = decimal.Decimal(self.weight)*10
            height_factor = decimal.Decimal(self.height)*decimal.Decimal(6.25)
            age_factor = decimal.Decimal(age)*decimal.Decimal(5)
            bmr = weight_factor + height_factor - age_factor + gender_factor
        return bmr
    
    @property
    def total_daily_energy_expenditure(self):
        # this is based on mifflin st jeor equation - see wikipedia
        age = calculate_age(self.date_of_birth)
        bmr = 0
        tdee = 0
        gender_factor = decimal.Decimal(5)
        activity_level_dict = {'S': 1.2,'MA': 1.375,
                               'OA': 1.55, 'HA': 1.725,
                               'VHA': 1.9}
        if self.gender == 'F':
            gender_factor = decimal.Decimal(-161)
        if self.weight and self.height and age and self.gender and self.activity_level:
            weight_factor = decimal.Decimal(self.weight)*10
            height_factor = decimal.Decimal(self.height)*decimal.Decimal(6.25)
            age_factor = decimal.Decimal(age)*decimal.Decimal(5)
            bmr = weight_factor + height_factor - age_factor + gender_factor
            tdee = bmr * decimal.Decimal(activity_level_dict[self.activity_level])
        return tdee

    

@receiver(pre_save, sender=Account)
def skip_saving_file(sender, instance, **kwargs):
    if not instance.pk and not hasattr(instance, _UNSAVED_FILEFIELD):
        setattr(instance, _UNSAVED_FILEFIELD, instance.image_path)
        instance.image = None


@receiver(post_save, sender=Account)
def save_file(sender, instance, created, **kwargs):
    if created and hasattr(instance, _UNSAVED_FILEFIELD):
        instance.image_path = getattr(instance, _UNSAVED_FILEFIELD)
        instance.save()
