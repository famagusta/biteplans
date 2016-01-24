from django.db import models
from django.contrib.auth.models import User


class USDAIngredient(models.Model):
    food_id = models.CharField(primary_key=True, max_length=10)
    name = models.TextField()
    water = models.DecimalField(max_digits=20,
                                decimal_places=10, null=True)
    def __unicode__(self):
    	return self.name
