/* controller for createplan pages */
/* jshint -W106 */
/* jshint -W004 */
/* jshint -W083 */

/* global app, $, console */

app.controller('viewPlanController', ['$scope', '$window', 'AuthService',
    '$routeParams', 'searchService', '$location', 'planService', '$rootScope',
    'constants', 'profileService',
    function($scope, $window, AuthService, $routeParams, searchService,
        $location, planService, $rootScope, constants, profileService){
        'use strict';
        
        /* NO AUTH REQUIRED */
       
        
        var params = $routeParams;

        var urlParamWeek1 = params.week1? parseInt(params.week1) : 1;
        var urlParamDay1 = params.day1? parseInt(params.day1) : 1;

        /*if authed then create these objects*/
        /* week & day count for current plan */
        $scope.weekCount = [];
        $scope.dayCount = [];


        $scope.dayWeekNos = 0;
        $scope.currentDayWeekNos = 7*(urlParamWeek1 - 1) + urlParamDay1;

        /* stores the details to get current day plan
                this is used to make the first query */
        $scope.dayplan1 = {
            'day_no':  urlParamDay1,
            'week_no': urlParamWeek1
        };

        var activityLevelChoicesDict = {
            'S': 'Sedentary',
            'MA': 'Mild Activity',
            'OA': 'Moderate Activity',
            'HA': 'Heavy Activity',
            'VHA': 'Very Heavy Activity'
        };
        
        $scope.activityDescriptions = {
            'Sedentary': 'Little or no Exercise/ desk job',
            'Mild Activity': 'Light exercise/ sports 1 – 3 days/ week',
            'Moderate Activity': 'Moderate Exercise, sports 3 – 5 days/ week',
            'Heavy Activity': 'Heavy Exercise/ sports 6 – 7 days/ week',
            'Very Heavy Activity': 'Very heavy exercise/ physical job/ training 2 x/ day'
        };
        $scope.profileInfo={};
        
        $scope.constants = constants.userOb;
        
        $scope.$watchCollection('constants', function(newVal, oldVal){
            if(newVal.status){
                getUserProfile(newVal.pk);
            }
            
        })
        
        var getUserProfile = function(id){
            profileService.getUserProfile(id)
                .then(function(response) {
                    //model for storing response from API
                    $scope.profileInfo = response; 
                    }, function(error) {
                        console.log(error);
            });
        }
        /* get the diet plan in question from the server */
        planService.getDietPlan($routeParams.id).then(function(response){
                $scope.plan = response;
                $scope.plan.activity_level = 
                    activityLevelChoicesDict[response.activity_level];
                /* rewrite some object variables in correct format
                        as the response object stringifies everything */
                $scope.plan.age = parseInt($scope.plan.age);
                $scope.plan.height = parseFloat($scope.plan.height);
                $scope.plan.weight = parseFloat($scope.plan.weight);
                $scope.plan.duration = parseInt($scope.plan.duration);
                $scope.dayWeekNos = $scope.plan.duration*7;

                for (var i = 1; i <= $scope.plan.duration; i++){
                    $scope.weekCount.push({'id': i,
                                            'name': 'Week' +' ' + i
                                          });
                }
                
                for (var j = 1; j <= 7; j++){
                    $scope.dayCount.push({'id': j,
                                          'name': 'Day' + ' ' + j
                                        });
                }
            }, function(error){
                console.log(error);
            });

        var isToasting = false;
        var gender_lookup = {'Male':'M', 'Female': 'F'};
        
        // a very basic look up to test BMR match
        $scope.$watch('[profileInfo, plan]', function(newVal, oldVal){
            var toast_msg = 'This plan is not suited for you!';
            
            if((urlParamWeek1===1 && urlParamDay1===1)){
                if(newVal[0] && newVal[1]){
                    
                    if(newVal[1].upper_bmr && newVal[1].lower_bmr 
                       && newVal[0].gender && newVal[1].gender && newVal[0].basal_metabolic_rate){
                        
                        if(newVal[1].gender!=='All'){
                            if(gender_lookup[newVal[1].gender] !== newVal[0].gender){
                                toast_msg += ' Gender Mismatch.';
                                isToasting = true;
                            }
                        } 

                        if(newVal[0].basal_metabolic_rate > 
                                  parseFloat(newVal[1].upper_bmr)){
                            toast_msg += 
                                ' Your body needs more calories to achieve this goal. Your estimated BMR is ' + newVal[0].basal_metabolic_rate + ' kcal';
                            isToasting = true;

                        } else if(newVal[0].basal_metabolic_rate < 
                                  parseFloat(newVal[1].lower_bmr)){
                            toast_msg += ' Your body needs fewer calories to achieve this goal'  
                                + newVal[0].basal_metabolic_rate + ' kcal';
                            isToasting = true;
                        } 

                        if(isToasting){
                            Materialize.toast(toast_msg, 5000, 'rounded');
                        }
                    };
                }
            }
            
        }, true);
        
        /*opens jump to or copy to modal*/
        $scope.openJumpToModal = function(type){
            $scope.jumpToModalType = type;
            $('#jump-to-modal').openModal();
        };

        
        /* Function to update day_no or week_no */

        $scope.updateDayPlan1 = function(param, val){
            // made shorter with ternary operator and modulo division
            var multiplier = param === 'week_no' ? 7 : param === 'day_no' ? 1 : 0;

            $scope.currentDayWeekNos += (multiplier*val);

            if($scope.currentDayWeekNos > $scope.dayWeekNos){
                $scope.currentDayWeekNos = $scope.currentDayWeekNos % 
                $scope.dayWeekNos;
            }else if ($scope.currentDayWeekNos <= 0){
                $scope.currentDayWeekNos = $scope.currentDayWeekNos + 
                $scope.dayWeekNos;
            }

            $scope.dayplan1.day_no = ($scope.currentDayWeekNos % 7);
            if($scope.dayplan1.day_no === 0){
                $scope.dayplan1.day_no = 7;
            }
            $scope.dayplan1.week_no = Math.ceil($scope.currentDayWeekNos/7);

            $scope.getDayPlan($scope.dayplan1.day_no,
                    $scope.dayplan1.week_no, 1);

        };

        // TODO: update for API
        $scope.getDayPlan = function(day, week){
            var id = $routeParams.id;
            planService.getdayplan(id, day, week).then(function(response){ 
                
                $scope.dayplan1.id = response.id;
                $scope.dayplan1.day_no = response.day_no;
                $scope.dayplan1.week_no = response.week_no;
                

                for (var i = 0; i < response.mealplan.length; i++){
                    response.mealplan[i].mealname = response.mealplan[i].name;
                    delete response.mealplan[i].name;
                    var dateStr = 'July 21, 1983 ' + response.mealplan[i].time;
                    var b = new Date(dateStr);
                    response.mealplan[i].time = b;
                    response.mealplan[i].counter = i;

                    /* coerce string responses into floats to avoid angular error
                            do samething for recipes as well. check null cases */
                    for (var j = 0; j < response.mealplan[i].mealingredient.length; j++){
                        response.mealplan[i].mealingredient[j].quantity =
                            parseFloat(response.mealplan[i].mealingredient[j].quantity);
                    }

                    // TODO: similar thing for recipes
                    //parse recipe servings to float
                    for (var j = 0; j <response.mealplan[i].mealrecipe.length; j++){
                        response.mealplan[i].mealrecipe[j].servings =
                            parseFloat(response.mealplan[i].mealrecipe[j].servings);
                    }
                }
                
                $scope.mealPlanNameArray = response.mealplan;
                
                // possibly useless piece of for loop
//                for (var m = 0; m < $scope.mealPlanNameArray.length; m++){
//                    $scope.mealPlanNameArray[m].mealNutrition = {};
//                }
                
                console.log($scope.mealPlanNameArray);
                if(!($scope.dayplan1.day_no===1 && $scope.dayplan1.week_no===1)){
                    
                        $location.search('week1', week);
                        $location.search('day1', day);
                    
                }
            }, function(error){
                console.log(error);
            });
            
        };

        //get initial data for day1 and week 1 of the plan
        $scope.getDayPlan($scope.dayplan1.day_no, $scope.dayplan1.week_no, 1);

        // function to populate additional ingredients info inside mealplan array
        $scope.getAdditionalIngredientsInfo = function(){
            if ($scope.mealPlanNameArray !== undefined){
                for (var i = 0; i < $scope.mealPlanNameArray.length; i++){
                    if ($scope.mealPlanNameArray[i].mealingredient !== undefined){
                        for (var j = 0; j < $scope.mealPlanNameArray[i]
                             .mealingredient.length;j++){
                            //callback function to deal with the 
                            //asynchronous call within for loop
                            (function(cntr_i,cntr_j){
                                $scope.mealPlanNameArray[cntr_i].mealingredient[cntr_j]
                                    .additionalIngInfo = {};
                                searchService.get_ingredient_addtnl_info(
                                    $scope.mealPlanNameArray[cntr_i].mealingredient[cntr_j]
                                    .ingredient.id).then(function(response){
                                        //model for storing response from API 
                                        $scope.mealPlanNameArray[cntr_i]
                                            .mealingredient[cntr_j].additionalIngInfo =
                                            response;
                                    },
                                    function(error){
                                        console.log(error);
                                    });
                            })(i, j);
                        }
                    }

                    // same for recipes
                    if ($scope.mealPlanNameArray[i].mealrecipe !== undefined){
                        for (var j = 0; j < $scope.mealPlanNameArray[i].mealrecipe.length; 
                             j++){
                            //callback function to deal with the 
                            //asynchronous call within for loop
                            (function(cntr_i, cntr_j){
                                $scope.mealPlanNameArray[cntr_i].mealrecipe[cntr_j]
                                    .additionalRecInfo = {};
                                searchService.get_recipe_addtnl_info(
                                    $scope.mealPlanNameArray[cntr_i].mealrecipe[cntr_j]
                                    .recipe.id).then(function(response){
                                        //model for storing response from API 
                                        $scope.mealPlanNameArray[cntr_i]
                                            .mealrecipe[cntr_j].additionalRecInfo =
                                            response;
                                    },function(error){
                                        console.log(error);
                                    });
                            })(i, j);
                        }
                    }
                }
            }
        };

        $scope.$watchCollection('mealPlanNameArray', function(){
            $scope.getAdditionalIngredientsInfo();
        });


        var checkIngredNutritionQty = function(ingredient, nutrient, isAdditional){
            /* check if our ingredient and nutrient have valid numbers */
            var result = false;
            
            if(isAdditional && ingredient.additionalIngInfo!==undefined){
                if (ingredient.additionalIngInfo[nutrient] && ingredient.quantity && ingredient.unit.weight){
                    result = true;
                }
            } else {
                if (ingredient.ingredient[nutrient] && ingredient.quantity && ingredient.unit.weight){
                    result = true;
                }
            }
            //console.log(result);
            return result;
        };

        var checkRecipeNutritionQty = function(recipe, nutrient, isAdditional){
            /* check if our recipe and nutrient have valid numbers */
            var result = false;
            
            if(isAdditional && recipe.additionalRecInfo!==undefined){
                if (recipe.additionalRecInfo[nutrient] && recipe.servings){
                    result = true;
                }
            } else {
                if (recipe.recipe[nutrient] && recipe.servings){
                    result = true;
                }
            }
            //console.log(result);
            return result;
        };

        
        // meal wise nutrition info
        $scope.calcMealNutrientVal = function(index, nutrient, isAdditional){
            var total = [];
            
            if ($scope.mealPlanNameArray){
                for (var i = 0; i < $scope.mealPlanNameArray.length; i++){
                    var q = 0;
                    /* add nutrition information of ingredients */
                    for (var j = 0; j < $scope.mealPlanNameArray[i].mealingredient
                         .length; j++){
                        if (isAdditional && $scope.mealPlanNameArray[i].mealingredient[j]
                            .additionalIngInfo !== undefined){

                            if(checkIngredNutritionQty($scope.mealPlanNameArray[i]
                                                       .mealingredient[j], nutrient, isAdditional)){
                                q += parseFloat(
                                    $scope.mealPlanNameArray[i].mealingredient[j]
                                    .additionalIngInfo[nutrient]) *
                                    parseFloat(
                                        $scope.mealPlanNameArray[i].mealingredient[j]
                                        .quantity) *
                                    parseFloat(
                                        $scope.mealPlanNameArray[i].mealingredient[j]
                                        .unit.weight) / 100;
                            }
                        }
                        else
                        {
                            if(checkIngredNutritionQty($scope.mealPlanNameArray[
                                i].mealingredient[j], nutrient, false)){
                                q += parseFloat($scope.mealPlanNameArray[i]
                                                .mealingredient[j].ingredient[nutrient])*
                                    parseFloat($scope.mealPlanNameArray[i]
                                               .mealingredient[j].quantity) *
                                    parseFloat($scope.mealPlanNameArray[i]
                                               .mealingredient[j].unit.weight) / 100;

                            }
                        }
                    }
                    /* add nutrition information of recipes */
                    for (var j = 0; j < $scope.mealPlanNameArray[
                        i].mealrecipe.length; j++)
                    {
                        if (isAdditional){
                            if(checkRecipeNutritionQty($scope.mealPlanNameArray[
                                i].mealrecipe[j], nutrient, isAdditional)){
                                q += parseFloat($scope.mealPlanNameArray[i].mealrecipe[j]
                                    .additionalRecInfo[nutrient]) *
                                    parseFloat($scope.mealPlanNameArray[i]
                                               .mealrecipe[j].servings);
                            }
                        }
                        else{
                            if(checkRecipeNutritionQty($scope.mealPlanNameArray[
                                i].mealrecipe[j], nutrient, false)){
                                q += parseFloat($scope.mealPlanNameArray[i]
                                                .mealrecipe[j].recipe[nutrient]) *
                                    parseFloat($scope.mealPlanNameArray[i]
                                               .mealrecipe[j].servings);
                            }
                        }
                    }
                    total.push(q);
                }

                if(index>=0){
                    return total[index];
                }else{
                    var return_val = 
                        total.length>0? total.reduce(function(a,b){return a+b}) : 0;
                    return return_val;
                }
            } 
        };

        $scope.openMealInfoModal = function(index){
            $('#meal-info-modal').openModal();
            $scope.selected = index;
        };

        $scope.calendarSelect = new Date();
        $scope.followPlan2 = function(plan){
            $scope.followDate = moment($scope.calendarSelect).format(
                                'YYYY-MM-DD');
            $scope.followPlanObject = {
                dietplan: plan.id,
                start_date: $scope.followDate
            };
            planService.followDietPlan(
                $scope.followPlanObject).then(
                function(response)
                {
                    if(response.error){
                        $scope.followPlanError = "Sorry, selected Date conflicts with another dietplan on the same day! Please select another date.";
                    }else{
                        $scope.followPlanError = "";
                        $window.location.href = '/dashboard/summary?date=' +
                            $scope.followDate
                    }
                }, function(error)
                {

                    console.log(error);
                });
        };
        
        
        $scope.followPlan = function(plan){
            
            /* something strange happens inside datepicker with local variables */
            $scope.followPlanObject = {};

            if(constants.userOb.status){
                var $input = $('.datepicker_btn')
                .pickadate({
                    format: 'yyyy-mm-dd',
                    formatSubmit: false,
                    today: 'Today',
                    clear: '',
                    close: 'Close',
                    closeOnSelect: true,
                    onRender: function(){
                        /* Restyle the date picker for better UI UX*/
                        var noOfPickers = $('.picker__month-display').length;
                        
                        for (var i=0; i< noOfPickers; i++){
                            $('.picker__month-display')[i].innerHTML = "";
                            $('.picker__day-display')[i].innerHTML = "";
                            $('.picker__weekday-display')[i].innerHTML = "";
                            $('.picker__year-display')[i].innerHTML = "";

                            $('.picker__weekday-display')[i].innerHTML = "Follow A Plan";
                            $('.picker__month-display')[i].innerHTML = "Select Start Date";
                        }
                    }, 
                    onSet: function(context){
                        //make api call to follow the plan on setting of date
                        /* convert to ISO 8601 date time string for serializer
                          acceptance*/
                        if (context.select)
                        {
                            var date_to_set = new Date(
                                context.select).toISOString();
                            $scope.followDate = moment(
                                date_to_set).format(
                                'YYYY-MM-DD');
                            //close the date picker
                            this.close();
                            $scope.followPlanObject = {
                                dietplan: plan.id,
                                start_date: $scope.followDate
                            };
                            planService.followDietPlan(
                                $scope.followPlanObject).then(
                                function(response)
                                {
                                    if(response.error){
                                        $scope.followPlanError = "Sorry, selected Date conflicts with another dietplan on the same day! Please select another date.";
                                    }else{
                                        $scope.followPlanError = "";
                                        $window.location.href = '/dashboard/summary?date=' +
                                            $scope.followDate
                                    }
                                }, function(error)
                                {

                                    console.log(error);
                                });
                        }
                    }
                });
            }
            else{
                /* prompt user for login */
                $rootScope.$emit('authFailure');
            }
        };
        
        $scope.percentNutrient = function(nutrient){
            var total_energy = $scope.calcMealNutrientVal(-1, 'energy_kcal', false, 1);
            var nutrient_val = $scope.calcMealNutrientVal(-1, nutrient, false, 1);
            var multiplier = 4;
            if (nutrient==="fat_tot"){
                multiplier = 9;
            }
            return 100*multiplier*nutrient_val/total_energy;
        };
        
        $scope.shortlistPlan = function(planId){
            if(constants.userOb.status){
                /* check authentication */
                var objToSave = {
                    dietplan: planId
                };
                planService.addPlanToShortlist(objToSave)
                    .then(function(
                    response)
                {
                    $scope.saveStatus = "Successfully saved the plan in your saved plans!!"
                   //getUserPlans();
                }, function(error)
                {
                    $scope.saveStatus = "There was an error in saving your plans!!";
                    console.log(error);
                });                        
            }
            else{
                /* prompt user for login */
                $rootScope.$emit('authFailure');
            }
        };
                
    }
]);