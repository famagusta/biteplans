''' models for storing usda ingredients and indinutrient
    data as ingredients
'''

from django.db import models


class Ingredient(models.Model):
    '''Model for storing basic ingredient information from
    various sources. All units are measured per 100gm'''
    id = models.AutoField(primary_key=True)
    name = models.TextField()
    food_group = models.CharField(null=True, blank=True, max_length=191)
    source = models.CharField(null=True, blank=True, max_length=191)
    brand = models.CharField(null=True, blank=True, max_length=191)

    # moisture content of food in grams
    water = models.DecimalField(null=True,
                                max_digits=11,
                                decimal_places=3)
    # energy content of food in kilo calories
    energy_kcal = models.DecimalField(max_digits=11,
                                      decimal_places=3,
                                      null=True)
    # protein content in food in grams
    protein_tot = models.DecimalField(null=True,
                                      max_digits=11,
                                      decimal_places=3)
    # total fat (sat + unsat) content in food in grams
    fat_tot = models.DecimalField(null=True,
                                  max_digits=11,
                                  decimal_places=3)
    # total carbohydrate content (all sugars + fiber) in food in grams
    carbohydrate_tot = models.DecimalField(null=True,
                                           max_digits=11,
                                           decimal_places=3)

    # total fiber content in food in grams
    fiber_tot = models.DecimalField(max_digits=11,
                                   decimal_places=3,
                                   null=True)

    # total sugar content
    sugar_tot = models.DecimalField(null=True,
                                    max_digits=11,
                                    decimal_places=3)
    def __unicode__(self):
        return self.name

    class Meta:
        '''name db table'''
        db_table = 'ingredients_ingredient'


class AddtnlIngredientInfo(models.Model):
    '''Model for storing basic ingredient information from
    various sources. All units are measured per 100gm'''
    # one to one link to the ingredients object
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)

    # Metallic Minerals
    calcium_mg = models.DecimalField(null=True, max_digits=11,
                                     decimal_places=3)
    # phosphorous in mg
    phosphorus_mg = models.DecimalField(null=True, max_digits=11,
                                        decimal_places=3)
    # magnesium in mg
    magnesium_mg = models.DecimalField(null=True, max_digits=11,
                                       decimal_places=3)
    # iron in mg
    iron_mg = models.DecimalField(null=True, max_digits=11,
                                  decimal_places=3)
    potassium_mg = models.DecimalField(max_digits=11, decimal_places=3,
                                       null=True)
    sodium_mg = models.DecimalField(max_digits=11, decimal_places=3,
                                    null=True)
    zinc_mg = models.DecimalField(null=True, max_digits=11,
                               decimal_places=3)
    copper_mg = models.DecimalField(null=True, max_digits=11,
                                    decimal_places=3)
    manganese_mg = models.DecimalField(null=True, max_digits=11,
                                       decimal_places=3)
    selenium_mcg = models.DecimalField(null=True, max_digits=11,
                                       decimal_places=3)
    # Vitamins
    # find out different types of vit a
    vitamin_a_iu = models.DecimalField(null=True, max_digits=11,
                                       decimal_places=3)
    vitamin_a_rae_mcg = models.DecimalField(null=True, max_digits=11,
                                       decimal_places=3)
    retinol_mcg = models.DecimalField(null=True, max_digits=11,
                                      decimal_places=3)
    thiamine_mg = models.DecimalField(null=True, max_digits=11,
                                      decimal_places=3)
    riboflavin_mg = models.DecimalField(null=True, max_digits=11,
                                        decimal_places=3)
    niacin_mg = models.DecimalField(null=True, max_digits=11,
                                    decimal_places=3)
    total_b6_mg = models.DecimalField(null=True, max_digits=11,
                                      decimal_places=3)
    folic_acid_total_mcg = models.DecimalField(null=True, max_digits=11,
                                               decimal_places=3)
    vitamin_c_mg = models.DecimalField(null=True, max_digits=11,
                                       decimal_places=3)
    vitamin_b12_mcg = models.DecimalField(null=True, max_digits=11,
                                       decimal_places=3)
    vitamin_e_mg = models.DecimalField(null=True, max_digits=11,
                                       decimal_places=3)
    vitamin_d_mcg = models.DecimalField(null=True, max_digits=11,
                                       decimal_places=3)
    vitamin_k_mcg = models.DecimalField(null=True, max_digits=11,
                                        decimal_places=3)

    # Lipids & Cholesterol
    fa_sat_g = models.DecimalField(null=True, max_digits=11,
                                 decimal_places=3)
    fa_mono_g = models.DecimalField(null=True, max_digits=11,
                                  decimal_places=3)
    fa_poly_g = models.DecimalField(null=True, max_digits=11,
                                  decimal_places=3)
    cholestrl_mg = models.DecimalField(max_digits=11, decimal_places=3,
                                    null=True)

    def __unicode__(self):
        return self.ingredient.name

    class Meta:
        '''name db table'''
        db_table = 'ingredients_addtnlingredientinfo'


class IngredientCommonMeasures(models.Model):
    '''this model stores different measures for an ingredient
       for e.g. 1tbsp butter, 1 cup butter and the weights
       associated with them'''
    id = models.AutoField(primary_key=True)
    ingred_id = models.ForeignKey(Ingredient, on_delete=models.CASCADE,
                                 related_name="measure")
    seq = models.IntegerField()
    amount = models.DecimalField(null=True, max_digits=11, decimal_places=3)
    description = models.CharField(max_length=191)
    weight = models.DecimalField(null=True, max_digits=11, decimal_places=3)

    def __unicode__(self):
        return self.description

    class Meta:
        '''name db table'''
        db_table = 'ingredients_ingredientcommonmeasures'
