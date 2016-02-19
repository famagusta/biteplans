'''script to populate the ingredients database
USDAIngredient and Indian Nutrient Database
TODO : add the code for indian nutrient database
as well'''

import os

# you need this line to tell python that we are in django
# project bitespace
os.environ.setdefault("DJANGO_SETTINGS_MODULE",
                      "bitespace_project_config.settings")

import tablib
from import_export import resources
import csv

from bitespace_app.models import USDAIngredient

imported_resource = resources.modelresource_factory(model=USDAIngredient)()

imported_data = tablib.import_set(open('data/ABBREV.csv').read())
result = imported_resource.import_data(imported_data, dry_run=True)

if result.has_errors() is not True:
    result = imported_resource.import_data(imported_data, dry_run=False)
