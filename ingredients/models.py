''' models for storing usda ingredients and indinutrient
    data as ingredients
'''

from django.db import models


class USDAIngredient(models.Model):
    ''' model for ingredient specifying quantity of
    various componenets '''

    id = models.IntegerField(primary_key=True)
    shrt_desc = models.TextField()
    lng_desc = models.TextField()
    food_groups = models.CharField(null=True, blank=True, max_length=191)
    water = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    energy_kcal = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    protein = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    lipid_tot = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    ash = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    carbohydrate = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    fiber_td = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    sugar_tot = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    calcium = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    iron = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    magnesium = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    phosphorus = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    potassium = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    sodium = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    zinc = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    copper = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    manganese = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    selenium = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    vit_c = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    thiamin = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    riboflavin = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    niacin = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    panto_acid = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    vit_b6 = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    folate_tot = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    folic_acid = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    food_folate = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    folate_dfe = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    choline_tot = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    vit_b12 = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    vit_a_iu = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    vit_a_rae = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    retinol = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    alpha_carot = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    beta_carot = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    beta_crypt = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    lycopene = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    lut_zea = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    vit_e = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    vit_d = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    vit_d_iu = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    vit_k = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    fa_sat = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    fa_mono = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    fa_poly = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    cholestrl = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )

    def __unicode__(self):
        return self.shrt_desc


class USDAIngredientCommonMeasures(models.Model):
    '''this model stores different measures for an ingredient
       for e.g. 1tbsp butter, 1 cup butter and the weights
       associated with them'''
    id = models.AutoField(primary_key=True)
    ingred_id = models.ForeignKey(USDAIngredient, on_delete=models.CASCADE)
    seq = models.IntegerField()
    amount = models.IntegerField()
    description = models.CharField(max_length=191)
    weight = models.DecimalField(null=True, max_digits=11, decimal_places=3)


class IndianIngredient(models.Model):
    '''Model for storing data from the indian ingredients nutritional data
       source from NIN Hyderabad'''

    id = models.IntegerField(primary_key=True)

    name = models.TextField()

    moisture_g = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    protein_g = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    fat_g = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    minerals_g = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    crude_fiber_g = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    carbohydrates_g = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    energy_kcal = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    calcium_mg = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    phosphorus_mg = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    iron_mg = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    carotene_mcg = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    thiamine_mg = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    riboflavin_mg = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    niacin_mg = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    total_b6_mg = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    folic_acid_free_mcg = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    folic_acid_total_mcg = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    vitamin_c_mg = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )

    def __unicode__(self):
        return self.name
