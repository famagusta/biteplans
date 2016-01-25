from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from import_export import resources
from bitespace_app.models import USDAIngredient


class IngResource(resources.ModelResource):
	class Meta:
		model = USDAIngredient



class IngAdmin(ImportExportModelAdmin):
	resource_class = IngResource

admin.site.register(USDAIngredient, IngAdmin)
