from django.contrib import admin

# Register your models here.
''' Admin configuration '''
from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from import_export import resources
from bitespace_app.models import USDAIngredient

class IngResource(resources.ModelResource):
    ''' Made a resource abstracting the model to import the data from xls,csv '''
    class Meta:
        ''' Meta Data '''
        model = USDAIngredient

class IngAdmin(ImportExportModelAdmin):
    '''Register resource with admin'''
    resource_class = IngResource

admin.site.register(USDAIngredient, IngAdmin)
