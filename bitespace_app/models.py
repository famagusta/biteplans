""" A django model for our database usage!
"""

from django.db import models

class USDAIngredient(models.Model):
    ''' model for ingredient specifying quantity of various componenets '''

    id = models.IntegerField(primary_key=True)
    shrt_desc = models.TextField()
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
