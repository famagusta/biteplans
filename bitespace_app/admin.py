from django.contrib import admin

# Register your models here.
''' Admin configuration '''
from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from import_export import resources
from bitespace_app.models import USDAIngredient,IndiNutrientData

class IngResource(resources.ModelResource):
    ''' Made a resource abstracting the model to import the data from xls,csv '''
    class Meta:
        ''' Meta Data '''
        model = USDAIngredient

class IngAdmin(ImportExportModelAdmin):
    '''Register resource with admin'''
    resource_class = IngResource

class IndResource(resources.ModelResource):
    ''' Made a resource abstracting the model to import the data from xls,csv '''
    class Meta:
        ''' Meta Data '''
        model = IndiNutrientData

class IndAdmin(ImportExportModelAdmin):
    '''Register resource with admin'''
    resource_class = IndResource

admin.site.register(USDAIngredient, IngAdmin)
admin.site.register(IndiNutrientData, IndAdmin)
