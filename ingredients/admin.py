from django.contrib import admin

# Register your models here.
''' Admin configuration '''
from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from import_export import resources
from ingredients.models import Ingredient, IngredientCommonMeasures,\
    AddtnlIngredientInfo
from recipes.models import Recipe, RecipeIngredients
from authentication.models import Account
from dietplans.models import DietPlan, DayPlan, MealPlan, MealRecipe
from imported_recipes.models import ImportedRecipe, ImportedRecipeIngredients, \
    ImportedIngredientQuantity

from plan_calendar.models import UserPlanHistory, MealHistory, \
EventIngredient, EventRecipe, MyIngredient, MyRecipe


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
admin.site.register(AddtnlIngredientInfo)
admin.site.register(IngredientCommonMeasures)
admin.site.register(Recipe)
admin.site.register(RecipeIngredients)
admin.site.register(DietPlan)
admin.site.register(DayPlan)
admin.site.register(MealPlan)
admin.site.register(MealRecipe)
admin.site.register(ImportedRecipe)
admin.site.register(ImportedRecipeIngredients)
admin.site.register(ImportedIngredientQuantity)
admin.site.register(UserPlanHistory)
admin.site.register(MealHistory)
admin.site.register(EventIngredient)
admin.site.register(EventRecipe)
admin.site.register(MyIngredient)
admin.site.register(MyRecipe)
