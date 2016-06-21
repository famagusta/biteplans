import datetime
from haystack import indexes
from ingredients.models import Ingredient


class IngredientIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    name = indexes.CharField(model_attr='name')
    food_group = indexes.CharField(model_attr='food_group')
    carbohydrate = indexes.DecimalField(model_attr='carbohydrate_tot', null=True)
    protein = indexes.DecimalField(model_attr='protein_tot', null=True)
    fat = indexes.DecimalField(model_attr='fat_tot', null=True)
    water = indexes.DecimalField(model_attr='water', null=True)
    fiber = indexes.DecimalField(model_attr='fiber_tot', null=True)
    sugar = indexes.DecimalField(model_attr='sugar_tot', null=True)
    calories = indexes.DecimalField(model_attr='energy_kcal', null=True)
    
    def get_model(self):
        return Ingredient

    def index_queryset(self, using=None):
        """Used when the entire index for model is updated."""
        return self.get_model().objects.all()