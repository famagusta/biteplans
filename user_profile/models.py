from django.db import models
from authentication.models import Account
from datetime import date
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver


class UserPhysicalHistory(models.Model):
    '''model to store a users profile info and all historical values'''
    user = models.ForeignKey(Account, on_delete=models.CASCADE,
                             related_name="user_profile")
    version = models.IntegerField(editable=False)
    timestamp = models.DateTimeField(auto_now=True)
    weight = models.DecimalField(null=True, blank=True,
                                 max_digits=11, decimal_places=3)
    height = models.DecimalField(null=True, blank=True,
                                 max_digits=11, decimal_places=3)

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

    @property
    def age(self):
        today = date.today()
        dob = self.user.date_of_birth
        return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

    class Meta:
        unique_together = ('version', 'user')


# updates user_profile on update of physical parameters
@receiver(post_save, sender=Account)
def AccountPreSave(sender, instance, **kwargs):
    account_history = UserPhysicalHistory.objects\
        .filter(user=instance).order_by('-version')
    version = account_history[0].version + 1 if account_history else 1

    # check if we have a history for the user - populate the table if 
    # any physical parameter changes.
    if not account_history or instance.weight != account_history[0].weight\
            or instance.height != account_history[0].height\
            or instance.body_fat_percent != account_history[0].body_fat_percent\
            or instance.neck != account_history[0].neck\
            or instance.shoulder != account_history[0].shoulder\
            or instance.bicep != account_history[0].bicep\
            or instance.forearm != account_history[0].forearm\
            or instance.chest != account_history[0].chest\
            or instance.waist != account_history[0].waist\
            or instance.hip != account_history[0].hip\
            or instance.thigh != account_history[0].thigh\
            or instance.calf != account_history[0].calf:
        newhistory = UserPhysicalHistory.objects.create(user=instance,
                                         weight=instance.weight,
                                         height=instance.height,
                                         body_fat_percent=instance.body_fat_percent,
                                         neck=instance.neck,
                                         shoulder=instance.shoulder,
                                         bicep=instance.bicep,
                                         forearm=instance.forearm,
                                         chest=instance.chest,
                                         waist=instance.waist,
                                         hip=instance.hip,
                                         thigh=instance.thigh,
                                         calf=instance.calf,
                                         version=version
                                         )
        newhistory.save()