'''script to populate the ingredients database
USDAIngredient and Indian Nutrient Database
TODO : add the code for indian nutrient database
as well'''

import os
import codecs
# you need this line to tell python that we are in django
# project bitespace
os.environ.setdefault("DJANGO_SETTINGS_MODULE",
                      "bitespace_project_config.settings")

import tablib
from import_export import resources
import csv
from decimal import *
from bitespace_app.models import USDAIngredient, USDAIngredientCommonMeasures


with codecs.open('data/ABBREV_4USE.csv', 'rU', encoding='ascii') as f:
    reader = csv.reader(f, delimiter=",")
    for i, line in enumerate(reader):
        if i > 0:
            ingredient_id = int(line[0])
            shrt_desc = line[1]
            lng_desc = line[2]
            food_groups = line[3]
            if line[4] == '':
                water = None
            else:
                water = Decimal(line[4])
            energy_kcal = Decimal(line[5])
            protein = Decimal(line[6])
            lipid_tot = Decimal(line[7])
            if line[8] == '':
                ash = None
            else:
                ash = Decimal(line[8])
            carbohydrate = Decimal(line[9])
            if line[10] == '':
                fiber_td = None
            else:
                fiber_td = Decimal(line[10])
            if line[11] == '':
                sugar_tot = None
            else:
                sugar_tot = Decimal(line[11])
            if line[12] == '':
                calcium = None
            else:
                calcium = Decimal(line[12])
            if line[13] == '':
                iron = None
            else:
                iron = Decimal(line[13])
            if line[14] == '':
                magnesium = None
            else:
                magnesium = Decimal(line[14])
            if line[15] == '':
                phosphorus = None
            else:
                phosphorus = Decimal(line[15])
            if line[16] == '':
                potassium = None
            else:
                potassium = Decimal(line[16])
            if line[17] == '':
                sodium = None
            else:
                sodium = Decimal(line[17])
            if line[18] == '':
                zinc = None
            else:
                zinc = Decimal(line[18])
            if line[19] == '':
                copper = None
            else:
                copper = Decimal(line[19])
            if line[20] == '':
                manganese = None
            else:
                manganese = Decimal(line[20])
            if line[21] == '':
                selenium = None
            else:
                selenium = Decimal(line[21])
            if line[22] == '':
                vit_c = None
            else:
                vit_c = Decimal(line[22])
            if line[23] == '':
                thiamin = None
            else:
                thiamin = Decimal(line[23])
            if line[24] == '':
                riboflavin = None
            else:
                riboflavin = Decimal(line[24])
            if line[25] == '':
                niacin = None
            else:
                niacin = Decimal(line[25])
            if line[26] == '':
                panto_acid = None
            else:
                panto_acid = Decimal(line[26])
            if line[27] == '':
                vit_b6 = None
            else:
                vit_b6 = Decimal(line[27])
            if line[28] == '':
                folate_tot = None
            else:
                folate_tot = Decimal(line[28])
            if line[29] == '':
                folic_acid = None
            else:
                folic_acid = Decimal(line[29])
            if line[30] == '':
                food_folate = None
            else:
                food_folate = Decimal(line[30])
            if line[31] == '':
                folate_dfe = None
            else:
                folate_dfe = Decimal(line[31])
            if line[32] == '':
                choline_tot = None
            else:
                choline_tot = Decimal(line[32])
            if line[33] == '':
                vit_b12 = None
            else:
                vit_b12 = Decimal(line[33])
            if line[34] == '':
                vit_a_iu = None
            else:
                vit_a_iu = Decimal(line[34])
            if line[35] == '':
                vit_a_rae = None
            else:
                vit_a_rae = Decimal(line[35])
            if line[36] == '':
                retinol = None
            else:
                retinol = Decimal(line[36])
            if line[37] == '':
                alpha_carot = None
            else:
                alpha_carot = Decimal(line[37])
            if line[38] == '':
                beta_carot = None
            else:
                beta_carot = Decimal(line[38])
            if line[39] == '':
                beta_crypt = None
            else:
                beta_crypt = Decimal(line[39])
            if line[40] == '':
                lycopene = None
            else:
                lycopene = Decimal(line[40])
            if line[41] == '':
                lut_zea = None
            else:
                lut_zea = Decimal(line[41])
            if line[42] == '':
                vit_e = None
            else:
                vit_e = Decimal(line[42])
            if line[43] == '':
                vit_d = None
            else:
                vit_d = Decimal(line[43])
            if line[44] == '':
                vit_d_iu = None
            else:
                vit_d_iu = Decimal(line[44])
            if line[45] == '':
                vit_k = None
            else:
                vit_k = Decimal(line[45])
            if line[46] == '':
                fa_sat = None
            else:
                fa_sat = Decimal(line[46])
            if line[47] == '':
                fa_mono = None
            else:
                fa_mono = Decimal(line[47])
            if line[48] == '':
                fa_poly = None
            else:
                fa_poly = Decimal(line[48])
            if line[49] == '':
                cholestrl = None
            else:
                cholestrl = Decimal(line[49])
            ingredient = USDAIngredient(id=ingredient_id, shrt_desc=shrt_desc,
                                        lng_desc=lng_desc,
                                        food_groups=food_groups,
                                        water=water, energy_kcal=energy_kcal,
                                        protein=protein, lipid_tot=lipid_tot,
                                        ash=ash, carbohydrate=carbohydrate,
                                        fiber_td=fiber_td, sugar_tot=sugar_tot,
                                        calcium=calcium, iron=iron,
                                        magnesium=magnesium,
                                        phosphorus=phosphorus,
                                        potassium=potassium, sodium=sodium,
                                        zinc=zinc, copper=copper,
                                        manganese=manganese, selenium=selenium,
                                        vit_c=vit_c, thiamin=thiamin,
                                        riboflavin=riboflavin, niacin=niacin,
                                        panto_acid=panto_acid, vit_b6=vit_b6,
                                        folate_tot=folate_tot,
                                        folic_acid=folic_acid,
                                        food_folate=food_folate,
                                        folate_dfe=folate_dfe,
                                        choline_tot=choline_tot,
                                        vit_b12=vit_b12,
                                        vit_a_iu=vit_a_iu, vit_a_rae=vit_a_rae,
                                        retinol=retinol,
                                        alpha_carot=alpha_carot,
                                        beta_carot=beta_carot,
                                        beta_crypt=beta_crypt,
                                        lycopene=lycopene, lut_zea=lut_zea,
                                        vit_e=vit_e,
                                        vit_d=vit_d, vit_d_iu=vit_a_iu,
                                        vit_k=vit_k,
                                        fa_sat=fa_sat, fa_mono=fa_mono,
                                        fa_poly=fa_poly, cholestrl=cholestrl)
            ingredient.save()


ingredients = USDAIngredient.objects.all()
with codecs.open('data/usdaingredient_wts.csv', 'rU', encoding='ascii') as f:
    reader = csv.reader(f, delimiter=",")
    for i, line in enumerate(reader):
        if i > 0:
            ingredient_id = line[0]
            ingred_model = ingredients.filter(id=int(ingredient_id))[0]
            seq = int(line[1])
            amount = Decimal(line[2])
            description = line[3]
            weight = Decimal(line[4])
            ingred_measure = USDAIngredientCommonMeasures(
                ingred_id=ingred_model,
                seq=seq,
                amount=amount,
                description=description,
                weight=weight)
            ingred_measure.save()
