from django.db import models


class USDAIngredient(models.Model):

    id = models.CharField(primary_key=True, max_length=10)

    name = models.TextField()

    energy_kc = models.DecimalField(max_digits=5, decimal_places=3, null=True)

    protein_per_wt = models.DecimalField(
        null=True, max_digits=5, decimal_places=3
        )

    total_fat_per_wt = models.DecimalField(
        null=True, max_digits=5, decimal_places=3
        )

    carbohydrate_per_wt = models.DecimalField(
        null=True, max_digits=5, decimal_places=3
        )

    fiber_per_wt = models.DecimalField(
        null=True, max_digits=5, decimal_places=3
        )

    calcium_per_wt = models.DecimalField(
        null=True, max_digits=4, decimal_places=3
        )

    copper_per_wt = models.DecimalField(
        null=True, max_digits=5, decimal_places=3
        )

    iron_per_wt = models.DecimalField(null=True, max_digits=5, decimal_places=3)

    magnesium_per_wt = models.DecimalField(
        max_digits=5, decimal_places=3, null=True
        )

    potassium_per_wt = models.DecimalField(
        max_digits=5, decimal_places=3, null=True
        )

    zinc_per_wt = models.DecimalField(null=True, max_digits=5, decimal_places=3)

    vitamin_a_iu_per_wt = models.DecimalField(
        max_digits=6, decimal_places=3, null=True
        )

    vitamin_d_per_wt = models.DecimalField(
        null=True, max_digits=5, decimal_places=3
        )

    thiamin_per_wt = models.DecimalField(
        null=True, max_digits=5, decimal_places=3
        )

    riboflavin_per_wt = models.DecimalField(
        null=True, max_digits=5, decimal_places=3
        )

    vit_b6_per_wt_pyridoxine = models.DecimalField(
        null=True, max_digits=5, decimal_places=3
        )

    vitamin_b12_per_wt = models.DecimalField(
        null=True, max_digits=5, decimal_places=3
        )

    folate_per_wt = models.DecimalField(
        max_digits=4, decimal_places=3, null=True
        )

    niacin_per_wt = models.DecimalField(
        null=True, max_digits=5, decimal_places=3
        )

    pantothenic_acid_per_wt = models.DecimalField(
        null=True, max_digits=5, decimal_places=3
        )

    vitamin_c_per_wt = models.DecimalField(
        null=True, max_digits=4, decimal_places=3
        )

    vitamin_e_per_wt = models.DecimalField(
        null=True, max_digits=5, decimal_places=3
        )

    vitamin_k_per_wt = models.DecimalField(
        max_digits=4, decimal_places=3, null=True
        )

    fa_sat_per_wt = models.DecimalField(
        null=True, max_digits=5, decimal_places=3
        )

    monounsaturated_per_wt = models.DecimalField(
        null=True, max_digits=5, decimal_places=3
        )

    fa_poly_per_wt = models.DecimalField(
        null=True, max_digits=5, decimal_places=3
        )

    total_sugar = models.DecimalField(null=True, max_digits=5, decimal_places=3)

    def __unicode__(self):
        return self.name
