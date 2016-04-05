'''script to populate the ingredients database
USDAIngredient and Indian Nutrient Database
TODO : add the code for indian nutrient database
as well'''

import os
import codecs
# you need this line to tell python that we are in django
# project bitespace
os.environ.setdefault("DJANGO_SETTINGS_MODULE",
                      "biteplans_project_config.settings")

import tablib
from import_export import resources
import csv
from decimal import *
from ingredients.models import Ingredient, IngredientCommonMeasures, AddtnlIngredientInfo



# Populate ingredients table from the USDA Ingredients DB
with codecs.open('data/nutrition_info/ABBREV_4USE.csv', 'rU', encoding='ascii') as f:
    reader = csv.reader(f, delimiter=",")
    for i, line in enumerate(reader):
        if i > 0:
            ingredient_id = int(line[0])
            #shrt_desc = line[1]
            name = line[2]
            food_group = line[3]
            source = "USDA"
            water = None
            if line[4] != '':
                water = Decimal(line[4])
            
            energy_kcal = Decimal(line[5])
            protein_tot = Decimal(line[6])
            fat_tot = Decimal(line[7])
            carbohydrate_tot = Decimal(line[9])
            
            fiber_tot = None
            if line[10] != '':
                fiber_tot = Decimal(line[10])
            sugar_tot = None
            if line[11] != '':
                sugar_tot = Decimal(line[11])
            
            ingredient = Ingredient(id=ingredient_id, name=name, food_group=food_group,
                                    source=source, water=water, energy_kcal=energy_kcal,
                                    protein_tot=protein_tot, fat_tot=fat_tot, 
                                    carbohydrate_tot=carbohydrate_tot, fiber_tot=fiber_tot,
                                    sugar_tot=sugar_tot)
            ingredient.save()
            
            calcium = None
            if line[12] != '':
                calcium = Decimal(line[12])

            iron = None
            if line[13] != '':
                iron = Decimal(line[13])
            
            magnesium = None
            if line[14] != '':
                magnesium = Decimal(line[14])
            
            phosphorus = None
            if line[15] != '':
                phosphorus = Decimal(line[15])
            
            potassium = None
            if line[16] != '':
                potassium = Decimal(line[16])
            
            sodium = None
            if line[17] != '':
                sodium = Decimal(line[17])
            
            zinc = None
            if line[18] != '':
                zinc = Decimal(line[18])
            
            copper = None
            if line[19] != '':
                copper = Decimal(line[19])
            
            manganese = None
            if line[20] != '':
                manganese = Decimal(line[20])
            
            selenium = None
            if line[21] != '':
                selenium = Decimal(line[21])
            
            vit_c = None
            if line[22] != '':
                vit_c = Decimal(line[22])
            
            thiamine = None
            if line[23] != '':
                thiamine = Decimal(line[23])
                
            riboflavin = None
            if line[24] != '':
                riboflavin = Decimal(line[24])
            
            niacin = None
            if line[25] != '':
                niacin = Decimal(line[25])
            
            vit_b6 = None 
            if line[27] != '':
                vit_b6 = Decimal(line[27])
            
            folate_tot = None
            if line[28] != '':
                folate_tot = Decimal(line[28])
            
            vit_b12 = None
            if line[33] != '':
                vit_b12 = Decimal(line[33])
            
            vit_a_iu = None
            if line[34] != '':
                vit_a_iu = Decimal(line[34])
            
            vit_a_rae = None
            if line[35] != '':
                vit_a_rae = Decimal(line[35])
            
            retinol = None
            if line[36] != '':
                retinol = Decimal(line[36])
            
            vit_e = None
            if line[42] != '':
                vit_e = Decimal(line[42])
            
            vit_d = None
            if line[43] != '':
                vit_d = Decimal(line[43])
            
            vit_k = None
            if line[45] != '':
                vit_k = Decimal(line[45])
            
            fa_sat = None
            if line[46] != '':
                fa_sat = Decimal(line[46])
            
            fa_mono = None
            if line[47] != '':
                fa_mono = Decimal(line[47])
            
            fa_poly = None
            if line[48] != '':
                fa_poly = Decimal(line[48])
            
            cholestrl = None
            if line[49] != '':
                cholestrl = Decimal(line[49])
            
            addIngrdInfo = AddtnlIngredientInfo(ingredient=ingredient, 
                                              calcium_mg = calcium,
                                              phosphorus_mg = phosphorus,
                                              magnesium_mg = magnesium,
                                              iron_mg = iron,
                                              potassium_mg = potassium,
                                              sodium_mg = sodium,
                                              zinc_mg = zinc,
                                              copper_mg = copper,
                                              manganese_mg = manganese,
                                              selenium_mcg = selenium,
                                              vitamin_a_iu = vit_a_iu,
                                              vitamin_a_rae_mcg = vit_a_rae,
                                              retinol_mcg = retinol,
                                              thiamine_mg = thiamine,
                                              riboflavin_mg = riboflavin,
                                              niacin_mg = niacin,
                                              total_b6_mg = vit_b6,
                                              folic_acid_total_mcg = folate_tot,
                                              vitamin_c_mg = vit_c,
                                              vitamin_b12_mcg = vit_b12,
                                              vitamin_e_mg = vit_e,
                                              vitamin_d_mcg = vit_d,
                                              vitamin_k_mcg = vit_k,
                                              fa_sat_g = fa_sat,
                                              fa_mono_g = fa_mono,
                                              fa_poly_g = fa_poly,
                                              cholestrl_mg = cholestrl,)
            addIngrdInfo.save()
                        
       
# Populate ingredients table from the Indian Ingredients DB
with codecs.open('data/nutrition_info/nutritive_value_of_indian_foods.csv', 'rU', encoding='ascii') as f:
    reader = csv.reader(f, delimiter=",")
    for i, line in enumerate(reader):
        if i > 0:
            #ingredient_id = int(line[0])
            #shrt_desc = line[1]
            name = line[0]
            food_group = line[1]
            source = "National Institute of Nutrition, Hyderabad"
            water = None
            if line[2] not in ['', '-']:
                water = Decimal(line[2])
            
            energy_kcal = Decimal(line[8])
            
            protein_tot = None
            if line[3] not in ['', '-']:
                protein_tot = Decimal(line[3])
            
            fat_tot = None
            if line[4] not in ['', '-']:
                fat_tot = Decimal(line[4])
            
            carbohydrate_tot = None
            if line[7] not in ['', '-']:
                carbohydrate_tot = Decimal(line[7])
            
            fiber_tot = None
            if line[6] not in ['', '-']:
                fiber_tot = Decimal(line[6])
            sugar_tot = None
            
            ingredient = Ingredient(name=name, food_group=food_group,
                                    source=source, water=water, energy_kcal=energy_kcal,
                                    protein_tot=protein_tot, fat_tot=fat_tot, 
                                    carbohydrate_tot=carbohydrate_tot, fiber_tot=fiber_tot,
                                    sugar_tot=sugar_tot)
            ingredient.save()
            
            
            calcium = None
            if line[9] not in ['', '-']:
                calcium = Decimal(line[9])

            iron = None
            if line[11] not in ['', '-']:
                iron = Decimal(line[11])
            
            phosphorus = None
            if line[10] not in ['', '-']:
                phosphorus = Decimal(line[10])
            
            vit_c = None
            if line[19] not in ['', '-']:
                vit_c = Decimal(line[19])
            
            thiamine = None
            if line[13] not in ['', '-']:
                thiamine = Decimal(line[13])
                
            riboflavin = None
            if line[14] not in ['', '-']:
                riboflavin = Decimal(line[14])
            
            niacin = None
            if line[15] not in ['', '-']:
                niacin = Decimal(line[15])
            
            vit_b6 = None 
            if line[16] not in ['', '-']:
                vit_b6 = Decimal(line[16])
            
            folate_tot = None
            if line[18] not in ['', '-']:
                folate_tot = Decimal(line[18])
            
            vit_b12 = None
            vit_a_rae = None
            retinol = None
            vit_e = None
            vit_d = None
            vit_k = None
            fa_sat = None
            fa_mono = None
            fa_poly = None
            cholestrl = None
            
            addIngrdInfo = AddtnlIngredientInfo(ingredient=ingredient, 
                                              calcium_mg = calcium,
                                              phosphorus_mg = phosphorus,
                                              magnesium_mg = None,
                                              iron_mg = iron,
                                              potassium_mg = None,
                                              sodium_mg = None,
                                              zinc_mg = None,
                                              copper_mg = None,
                                              manganese_mg = None,
                                              selenium_mcg = None,
                                              vitamin_a_iu = None,
                                              vitamin_a_rae_mcg = None,
                                              retinol_mcg = None,
                                              thiamine_mg = thiamine,
                                              riboflavin_mg = riboflavin,
                                              niacin_mg = niacin,
                                              total_b6_mg = vit_b6,
                                              folic_acid_total_mcg = folate_tot,
                                              vitamin_c_mg = vit_c,
                                              vitamin_b12_mcg = None,
                                              vitamin_e_mg = None,
                                              vitamin_d_mcg = None,
                                              vitamin_k_mcg = None,
                                              fa_sat_g = None,
                                              fa_mono_g = None,
                                              fa_poly_g = None,
                                              cholestrl_mg = None,)
            addIngrdInfo.save()



with codecs.open('data/nutrition_info/caloriecount_unbranded_per100.csv', 'rU', encoding='ascii') as f:
    reader = csv.reader(f, delimiter=",")
    for i, line in enumerate(reader):
        if i > 0:
            name = line[0]
            food_group = line[1]
            source = ""
            water = None
            
            energy_kcal = Decimal(line[2])
            
            protein_tot = None
            if line[14] not in ['', '-']:
                protein_tot = Decimal(line[14])
            
            fat_tot = None
            if line[4] not in ['', '-']:
                fat_tot = Decimal(line[4])
            
            carbohydrate_tot = None
            if line[11] not in ['', '-']:
                carbohydrate_tot = Decimal(line[11])
            
            fiber_tot = None
            if line[12] not in ['', '-']:
                fiber_tot = Decimal(line[12])
                
            sugar_tot = None
            if line[13] not in ['', '-']:
                sugar_tot = Decimal(line[13])
                
            ingredient = Ingredient(name=name, food_group=food_group,
                                    source=source, water=water, energy_kcal=energy_kcal,
                                    protein_tot=protein_tot, fat_tot=fat_tot, 
                                    carbohydrate_tot=carbohydrate_tot, fiber_tot=fiber_tot,
                                    sugar_tot=sugar_tot)
            ingredient.save()
            
            calcium = None
            if line[17] not in ['', '-']:
                calcium = Decimal(line[17])
            
            sodium = None
            if line[9] not in ['', '-']:
                sodium = Decimal(line[9])
                
            iron = None
            if line[18] not in ['', '-']:
                iron = Decimal(line[18])
            
            potassium = None
            if line[10] not in ['', '-']:
                potassium = Decimal(line[10])
            
            phosphorus = None
            if line[25] not in ['', '-']:
                phosphorus = Decimal(line[25])
                
            magnesium = None
            if line[26] not in ['', '-']:
                magnesium = Decimal(line[26])
                
            zinc = None
            if line[30] not in ['', '-']:
                zinc = Decimal(line[30])
                
            copper = None
            if line[31] not in ['', '-']:
                copper = Decimal(line[31])

            manganese = None
            if line[28] not in ['', '-']:
                manganese = Decimal(line[28])

            selenium = None
            if line[27] not in ['', '-']:
                selenium = Decimal(line[27])
                
            vit_c = None
            if line[16] not in ['', '-']:
                vit_c = Decimal(line[16])
            
            thiamine = None
            if line[20] not in ['', '-']:
                thiamine = Decimal(line[20])
                
            riboflavin = None
            if line[21] not in ['', '-']:
                riboflavin = Decimal(line[21])
            
            niacin = None
            if line[22] not in ['', '-']:
                niacin = Decimal(line[22])
            
            vit_b6 = None 
            if line[23] not in ['', '-']:
                vit_b6 = Decimal(line[23])
            
            vit_b12 = None
            if line[24] not in ['', '-']:
                vit_b12 = Decimal(line[24])
                
            vit_a_iu = None
            if line[15] not in ['', '-']:
                vit_a_iu = Decimal(line[15])
                
            vit_e = None
            if line[19] not in ['', '-']:
                vit_e = Decimal(line[19])
            
            vit_k = None
            if line[29] not in ['', '-']:
                vit_k = Decimal(line[29])
                
            cholestrl = None
            if line[8] not in ['', '-']:
                cholestrl = Decimal(line[8])
                
            fa_sat = None
            if line[5] not in ['', '-']:
                fa_sat = Decimal(line[5])
            
            fa_mono = None
            if line[7] not in ['', '-']:
                fa_mono = Decimal(line[7])
            
            fa_poly = None
            if line[6] not in ['', '-']:
                fa_poly = Decimal(line[6])
            

            addIngrdInfo = AddtnlIngredientInfo(ingredient=ingredient, 
                                              calcium_mg = calcium,
                                              phosphorus_mg = phosphorus,
                                              magnesium_mg = magnesium,
                                              iron_mg = iron,
                                              potassium_mg = potassium,
                                              sodium_mg = sodium,
                                              zinc_mg = zinc,
                                              copper_mg = copper,
                                              manganese_mg = manganese,
                                              selenium_mcg = selenium,
                                              vitamin_a_rae_mcg = None,
                                              retinol_mcg = None,
                                              thiamine_mg = thiamine,
                                              riboflavin_mg = riboflavin,
                                              niacin_mg = niacin,
                                              total_b6_mg = vit_b6,
                                              folic_acid_total_mcg = None,
                                              vitamin_c_mg = vit_c,
                                              vitamin_b12_mcg = vit_b12,
                                              vitamin_e_mg = vit_e,
                                              vitamin_d_mcg = None,
                                              vitamin_k_mcg = vit_k,
                                              fa_sat_g = fa_sat,
                                              fa_mono_g = fa_mono,
                                              fa_poly_g = fa_poly,
                                              cholestrl_mg = cholestrl)
            addIngrdInfo.save()

# populate common ingredient measures for usda data
ingredients = Ingredient.objects.all()
with codecs.open('data/nutrition_info/usdaingredient_wts.csv', 'rU', encoding='ascii') as f:
    reader = csv.reader(f, delimiter=",")
    for i, line in enumerate(reader):
        if i > 0:
            ingredient_id = line[0]
            ingred_model = ingredients.filter(id=int(ingredient_id))[0]
            seq = int(line[1])
            amount = Decimal(line[2])
            description = line[3]
            weight = Decimal(line[4])
            ingred_measure = IngredientCommonMeasures(
                ingred_id=ingred_model,
                seq=seq,
                amount=amount,
                description=description,
                weight=weight)
            ingred_measure.save()

        
# Populate ingredients wts & measures from the Calorie Counts Ingredients DB    
ingredients = Ingredient.objects.all()
with codecs.open('data/nutrition_info/caloriecount_wts.csv', 'rU', encoding='ascii') as f:
    reader = csv.reader(f, delimiter=",")
    for i, line in enumerate(reader):
        if i > 0:
            ingredient_name = line[0]
            ingred_model = ingredients.filter(name=ingredient_name)[0]
            seq = 1
            amount = line[1]
            description = line[2]
            weight = Decimal(line[3])
            ingred_measure = IngredientCommonMeasures(
                ingred_id=ingred_model,
                seq=seq,
                amount=amount,
                description=description,
                weight=weight)
            ingred_measure.save()