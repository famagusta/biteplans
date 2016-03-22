""" models for our database usage!
"""

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
    gmwt_1 = models.DecimalField(
        null=True, max_digits=11, decimal_places=3
        )
    gmwt_desc1 = models.TextField()
    gmwt_2 = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )
    gmwt_desc2 = models.TextField()
    refuse_pct = models.DecimalField(
        max_digits=11, decimal_places=3, null=True
        )

    def __unicode__(self):
        return self.shrt_desc


class IndiNutrientData(models.Model):
    ''' Autogenerated model file csvimport Sat Feb 13 17:24:13 2016 '''

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


class Recipe(models.Model):
    '''Model to represent recipes extracted from the web
       https://github.com/fictivekin/openrecipes'''
    recipe_id = models.CharField(primary_key=True, max_length=191)
    description = models.TextField(null=True)
    ingredients = models.TextField()
    name = models.TextField()
    url = models.URLField(max_length=400)
    prep_time = models.CharField(null=True, max_length=191)
    cook_time = models.CharField(null=True, max_length=191)
    source = models.CharField(max_length=191)
    image = models.URLField(null=True, max_length=400)
    recipe_yield = models.CharField(null=True, max_length=191)
    date_published = models.CharField(null=True, max_length=191)

    def __unicode__(self):
        return self.name


class RecipeIngredients(models.Model):
    '''Model to represent all ingredients extracted from the
       recipes'''
    recipe_id = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient_tags = models.CharField(null=True, blank=True, max_length=1000)


class IngredientQuantity(models.Model):
    '''Model to represent various quantities of an ingredient
    in a recipe'''
    recipe_ingred_id = models.ForeignKey(RecipeIngredients,
                                         on_delete=models.CASCADE)
    ingredient_quanty = models.CharField(null=True, blank=True, max_length=191)
    ingredient_measure = models.CharField(null=True, blank=True,
                                          max_length=191)
