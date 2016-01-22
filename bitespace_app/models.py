from django.db import models
from django.contrib.auth.models import User


class USDAIngredient(models.Model):
    food_id = models.CharField(primary_key=True, max_length=10)
    name = models.TextField()
    water = models.DecimalField(max_digits=20,
                                decimal_places=10, null=True)
    energy_kc = models.DecimalField(max_digits=20,
                                    decimal_places=10, null=True)
    protein_wt = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    protein_cal = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    protein_percent_cal = models.DecimalField(max_digits=20,
                                              decimal_places=10, null=True)
    total_fat_wt = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    total_fat_cal = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    percent_fat_calories = models.DecimalField(max_digits=20,
                                               decimal_places=10, null=True)
    carbohydrate_wt = models.DecimalField(max_digits=20,
                                          decimal_places=10, null=True)
    carbohydrate_cal = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    percent_calories_from_cho = models.DecimalField(max_digits=20,
                                                    decimal_places=10,
                                                    null=True)
    fiber_wt = models.DecimalField(max_digits=20,
                                   decimal_places=10, null=True)
    fiber_cal = models.DecimalField(max_digits=20,
                                    decimal_places=10, null=True)
    calcium_wt = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    calcium_cal = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    copper_wt = models.DecimalField(max_digits=20,
                                    decimal_places=10, null=True)
    copper_cal = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    iron_wt = models.DecimalField(max_digits=20,
                                  decimal_places=10, null=True)
    iron_cal = models.DecimalField(max_digits=20,
                                   decimal_places=10, null=True)
    magnesium_wt = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    magnesium_cal = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    manganese_wt = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    manganese_cal = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    phosphorus_wt = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    phosphorus_cal = models.DecimalField(max_digits=20,
                                         decimal_places=10, null=True)
    potassium_wt = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    potassium_cal = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    selenium_wt = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    selenium_cal = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    sodium_wt = models.DecimalField(max_digits=20,
                                    decimal_places=10, null=True)
    sodium_cal = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    zinc_wt = models.DecimalField(max_digits=20,
                                  decimal_places=10, null=True)
    zinc_cal = models.DecimalField(max_digits=20,
                                   decimal_places=10, null=True)
    vitamin_a_iu_wt = models.DecimalField(max_digits=20,
                                          decimal_places=10, null=True)
    vitamin_a_iu_cal = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    vitamin_a_re_wt = models.DecimalField(max_digits=20,
                                          decimal_places=10, null=True)
    vitamin_a_re_cal = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    b_carotene_wt = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    b_carotene_cal = models.DecimalField(max_digits=20,
                                         decimal_places=10, null=True)
    a_carotene_wt = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    cryptoxanthin_wt = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    lycopene_wt = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    lutein_zeaxanthin_wt = models.DecimalField(max_digits=20,
                                               decimal_places=10, null=True)
    vitamin_d_wt = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    vitamin_d_cal = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    thiamin_wt = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    thiamin_cal = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    riboflavin_wt = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    riboflavin_cal = models.DecimalField(max_digits=20,
                                         decimal_places=10, null=True)
    vit_b6_wtpyridoxine = models.DecimalField(max_digits=20,
                                              decimal_places=10, null=True)
    vit_b6_calpyridoxine = models.DecimalField(max_digits=20,
                                               decimal_places=10, null=True)
    vitamin_b12_wt = models.DecimalField(max_digits=20,
                                         decimal_places=10, null=True)
    vitamin_b12_cal = models.DecimalField(max_digits=20,
                                          decimal_places=10, null=True)
    vitamin_c_wt = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    vitamin_c_cal = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    vitamin_e_wt = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    vitamin_e_cal = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    vitamin_k_wt = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    vitamin_k_cal = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    folate_wt = models.DecimalField(max_digits=20,
                                    decimal_places=10, null=True)
    folate_cal = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    niacin_wt = models.DecimalField(max_digits=20,
                                    decimal_places=10, null=True)
    niacin_cal = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    pantothenic_acid_wt = models.DecimalField(max_digits=20,
                                              decimal_places=10, null=True)
    pantothenic_acid_cal = models.DecimalField(max_digits=20,
                                               decimal_places=10, null=True)
    cholesterol_wt = models.DecimalField(max_digits=20,
                                         decimal_places=10, null=True)
    cholesterol_cal = models.DecimalField(max_digits=20,
                                          decimal_places=10, null=True)
    fa_sat_wt = models.DecimalField(max_digits=20,
                                    decimal_places=10, null=True)
    fa_sat_cal = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    butanoic_wt = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    butanoic_cal = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    hexanoic_wt = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    hexanoic_cal = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    octanoic_wt = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    octanoic_cal = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    decanoic_wt = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    decanoic_cal = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    dodecanoic_wt = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    dodecanoic_cal = models.DecimalField(max_digits=20,
                                         decimal_places=10, null=True)
    tetradecanoic_wt = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    tetradecanoic_cal = models.DecimalField(max_digits=20,
                                            decimal_places=10, null=True)
    pentadecanoic_wt = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    pentadecanoic_cal = models.DecimalField(max_digits=20,
                                            decimal_places=10, null=True)
    hexadecanoic_wt = models.DecimalField(max_digits=20,
                                          decimal_places=10, null=True)
    hexadecanoic_cal = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    heptadecanoic_wt = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    heptadecanoic_cal = models.DecimalField(max_digits=20,
                                            decimal_places=10, null=True)
    octadecanoic_wt = models.DecimalField(max_digits=20,
                                          decimal_places=10, null=True)
    octadecanoic_cal = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    eicosanoic_wt = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    eicosanoic_cal = models.DecimalField(max_digits=20,
                                         decimal_places=10, null=True)
    docosanoic_wt = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    docosanoic_cal = models.DecimalField(max_digits=20,
                                         decimal_places=10, null=True)
    tetracosanoic_wt = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    tetracosanoic_cal = models.DecimalField(max_digits=20,
                                            decimal_places=10, null=True)
    monounsaturated_wt = models.DecimalField(max_digits=20,
                                             decimal_places=10, null=True)
    monounsaturated_cal = models.DecimalField(max_digits=20,
                                              decimal_places=10, null=True)
    tetradecenoic_wt = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    tetradecenoic_cal = models.DecimalField(max_digits=20,
                                            decimal_places=10, null=True)
    hexadecenoic_wt = models.DecimalField(max_digits=20,
                                          decimal_places=10, null=True)
    hexadecenoic_cal = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    octadecenoic_wt = models.DecimalField(max_digits=20,
                                          decimal_places=10, null=True)
    octadecenoic_cal = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    eicosenoic_wt = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    eicosenoic_cal = models.DecimalField(max_digits=20,
                                         decimal_places=10, null=True)
    docosenoic_wt = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    docosenoic_cal = models.DecimalField(max_digits=20,
                                         decimal_places=10, null=True)
    fa_poly_wt = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    fa_poly_cal = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    la_wt_octadecadienoic = models.DecimalField(max_digits=20,
                                                decimal_places=10, null=True)
    la_cal_octadecadienoic = models.DecimalField(max_digits=20,
                                                 decimal_places=10, null=True)
    ala_wt_octadecatrienoic = models.DecimalField(max_digits=20,
                                                  decimal_places=10, null=True)
    ala_cal_octadecatrienoic = models.DecimalField(max_digits=20,
                                                   decimal_places=10,
                                                   null=True)
    octadecatetraenoic_wt = models.DecimalField(max_digits=20,
                                                decimal_places=10, null=True)
    octadecatetraenoic_cal = models.DecimalField(max_digits=20,
                                                 decimal_places=10, null=True)
    eicosatetraenoic_wt = models.DecimalField(max_digits=20,
                                              decimal_places=10, null=True)
    eicosatetraenoic_cal = models.DecimalField(max_digits=20,
                                               decimal_places=10, null=True)
    epa_wt_eicosapentaenoic = models.DecimalField(max_digits=20,
                                                  decimal_places=10, null=True)
    epa_cal_eicosapentaenoic = models.DecimalField(max_digits=20,
                                                   decimal_places=10,
                                                   null=True)
    docosapentaenoic_wt = models.DecimalField(max_digits=20,
                                              decimal_places=10, null=True)
    docosapentaenoic_cal = models.DecimalField(max_digits=20,
                                               decimal_places=10, null=True)
    dha_wt_docosahexaenoic = models.DecimalField(max_digits=20,
                                                 decimal_places=10, null=True)
    dha_cal_docosahexaenoic = models.DecimalField(max_digits=20,
                                                  decimal_places=10, null=True)
    phytosterols_wt = models.DecimalField(max_digits=20,
                                          decimal_places=10, null=True)
    phytosterols_cal = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    histidine_wt = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    histidine_cal = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    isoleucine_wt = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    isoleucine_cal = models.DecimalField(max_digits=20,
                                         decimal_places=10, null=True)
    leucine_wt = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    leucine_cal = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    lysine_wt = models.DecimalField(max_digits=20,
                                    decimal_places=10, null=True)
    lysine_cal = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    methionine_wt = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    methionine_cal = models.DecimalField(max_digits=20,
                                         decimal_places=10, null=True)
    phenylalanine_wt = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    phenylalanine_cal = models.DecimalField(max_digits=20,
                                            decimal_places=10, null=True)
    threonine_wt = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    threonine_cal = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    tryptophan_wt = models.DecimalField(max_digits=20,
                                        decimal_places=10, null=True)
    tryptophan_cal = models.DecimalField(max_digits=20,
                                         decimal_places=10, null=True)
    tyrosine_wt = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    tyrosine_cal = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    valine_wt = models.DecimalField(max_digits=20,
                                    decimal_places=10, null=True)
    valine_cal = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    alanine_wt = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    alanine_cal = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    arginine_wt = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    arginine_cal = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    aspartic_acid_wt = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    aspartic_acid_cal = models.DecimalField(max_digits=20,
                                            decimal_places=10, null=True)
    cystine_wt = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    cystine_cal = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    glutamic_acid_wt = models.DecimalField(max_digits=20,
                                           decimal_places=10, null=True)
    glutamic_acid_cal = models.DecimalField(max_digits=20,
                                            decimal_places=10, null=True)
    glycine_wt = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    glycine_cal = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    proline_wt = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    proline_cal = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    serine_wt = models.DecimalField(max_digits=20,
                                    decimal_places=10, null=True)
    serine_cal = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    total_isoflavones = models.DecimalField(max_digits=20,
                                            decimal_places=10, null=True)
    daidzein = models.DecimalField(max_digits=20,
                                   decimal_places=10, null=True)
    genistein = models.DecimalField(max_digits=20,
                                    decimal_places=10, null=True)
    glycitein = models.DecimalField(max_digits=20,
                                    decimal_places=10, null=True)
    ash_wt = models.DecimalField(max_digits=20,
                                 decimal_places=10, null=True)
    ash_cal = models.DecimalField(max_digits=20,
                                  decimal_places=10, null=True)
    percent_refuse = models.DecimalField(max_digits=20,
                                         decimal_places=10, null=True)
    caffeine_wt = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    caffeine_cal = models.DecimalField(max_digits=20,
                                       decimal_places=10, null=True)
    theobromine_wt = models.DecimalField(max_digits=20,
                                         decimal_places=10, null=True)
    theobromine_cal = models.DecimalField(max_digits=20,
                                          decimal_places=10, null=True)
    alcohol_wt = models.DecimalField(max_digits=20,
                                     decimal_places=10, null=True)
    alcohol_cal = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
    total_sugar = models.DecimalField(max_digits=20,
                                      decimal_places=10, null=True)
