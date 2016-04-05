from django.contrib import admin

# Register your models here.
''' Admin configuration '''
from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from import_export import resources
from ingredients.models import Ingredient


class IngResource(resources.ModelResource):
    ''' Made a resource abstracting the model to import the data from
        xls,csv '''
    class Meta:
        ''' Meta Data '''
        model = Ingredient


class IngAdmin(ImportExportModelAdmin):
    '''Register resource with admin'''
    resource_class = IngResource



admin.site.register(Ingredient, IngAdmin)