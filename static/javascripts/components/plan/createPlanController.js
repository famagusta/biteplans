/* controller for createplan pages */
'use strict';

app.controller('createPlanController', ['$scope', '$window', 'AuthService',
    '$routeParams', 'searchService', '$location', 'planService',
    function($scope, $window, AuthService, $routeParams,
        searchService, $location, planService) {

        /* CHECK AUTH STATUS - ONLY AUTHENTICATED USERS SHOULD
        BE ABLE TO CREATE A PLAN */
        AuthService.isAuthenticated()
            .then(function(response) {
                    var isAuth = response.status;
                    /*page is visible only if user is authenticated
                    TODO : page is visible only to creator of plan */
                    if (isAuth) {
                        /*if authed then create these objects*/

                        /* week & day count for current plan */
                        $scope.weekCount = [];
                        $scope.dayCount = [];
                        $scope.checklistIngs = [];
                        $scope.foodgroup = [];

                        /* phase of the day */
                        $scope.amPmArray = ['AM', 'PM'];

                        /* urls for previous and next buttons */
                        $scope.backUrl3 = '/plan2/' + $routeParams.id;
                        $scope.backUrl2 = '/plan/' + $routeParams.id;
                        $scope.nextUrl2 = '/plan3/' + $routeParams.id;

                        /* Function that updates the main descriptors of a diet plan
                        from the first create plan page */
                        $scope.initialize_plan = function() {
                            var id = $routeParams.id;
                            planService.updatePlan($scope.plan, id)
                                .then(function(response) {
                                    $location.path('/plan2/' +
                                        response.id);

                                }, function(error) {
                                    console.log(error);
                                });

                        };

                        /* get the diet plan in question from the server */
                        planService.getDietPlan($routeParams.id)
                            .then(function(response) {

                                $scope.plan = response;

                                /* rewrite some object variables in correct format
                                as the response object stringifies everything */
                                $scope.plan.age = parseInt($scope.plan
                                    .age);
                                $scope.plan.height = parseFloat(
                                    $scope.plan.height);
                                $scope.plan.weight = parseFloat(
                                    $scope.plan.weight);
                                $scope.plan.duration = parseInt(
                                    $scope.plan.duration);

                                for (var i = 1; i <= $scope.plan.duration; i++) {
                                    $scope.weekCount.push({
                                        'id': i,
                                        'name': 'Week' +
                                            ' ' + i
                                    });
                                }
                                for (var j = 1; j <= 7; j++) {
                                    $scope.dayCount.push({
                                        'id': i,
                                        'name': 'Day' + ' ' +
                                            j
                                    });
                                }

                            }, function(error) {
                                console.log(error);
                            });


                        /* stores the details to get current day plan
                        this is used to make the first query */
                        $scope.dayplan = {
                            'day_no': 1,
                            'week_no': 1
                        };

                        /* unit for height */
                        $scope.unit = 0;

                        /* Function to update day_no or week_no */
                        $scope.updateDayPlan = function(param, val,
                            index) {
                            console.log(param, val, index, $scope.plan.duration);

                            if (index === 1) {
                                /*if possible, write a shorter function using modulo operator
                            days increase all the time */
                                $scope.dayplan[param] += parseInt(
                                    val);

                                console.log($scope.dayplan);
                                if ($scope.dayplan['day_no'] > 7 *
                                    $scope.plan.duration) {
                                    $scope.dayplan['day_no'] = 1;
                                }
                                if ($scope.dayplan['week_no'] >
                                    $scope.plan
                                    .duration) {
                                    $scope.dayplan['week_no'] = 1;
                                }
                                else if ($scope.dayplan['week_no'] <
                                    1) {
                                    $scope.dayplan['week_no'] =
                                        $scope.plan
                                        .duration;
                                }

                                $scope.getDayPlan($scope.dayplan.day_no,
                                    $scope.dayplan.week_no);
                            }

                        };

                        // $scope.displayHeight = function(stringHeight) {
                        //     /* Display the height of a person for whom 
                        //     this plan is created */
                        //     if (stringHeight === 0) {
                        //         $scope.feet = 1;
                        //         $scope.inches = 0;
                        //         $scope.unit = string;
                        //     }
                        //     else {
                        //         $scope.metric = 1;
                        //         $scope.unit = string;
                        //     }
                        // };

                        //function to get current dayplan details including all meals and mealings
                        // TODO: update for API
                        $scope.getDayPlan = function(day, week) {
                            var id = $routeParams.id;
                            planService.getdayplan(id, day, week)
                                .then(function(response) {
                                    $scope.dayplan.id = response.id;
                                    $scope.dayplan.day_no = response.day_no;
                                    $scope.dayplan.week_no = response.week_no;
                                
                                    for (var i = 0; i <
                                        response.mealplan.length; i++
                                    ) {
                                        response.mealplan[i].mealname =
                                            response.mealplan[i]
                                            .name;
                                        delete response.mealplan[
                                            i].name;
                                        var dateStr =
                                            'July 21, 1983 ' +
                                            response.mealplan[i]
                                            .time;
                                        var b = new Date(
                                            dateStr);
                                        response.mealplan[i].time =
                                            b;
                                        response.mealplan[i].counter =
                                            i;

                                        /* coerce string responses into floats to avoid angular error
                                        do samething for recipes as well. check null cases */
                                        for (var j = 0; j <
                                            response.mealplan[i]
                                            .mealingredient.length; j++
                                        ) {
                                            response.mealplan[i]
                                                .mealingredient[
                                                    j].quantity =
                                                parseFloat(
                                                    response.mealplan[
                                                        i].mealingredient[
                                                        j].quantity
                                                );
                                        }

                                        // TODO: similar thing for recipes
                                    }

                                    $scope.mealPlanNameArray =
                                        response.mealplan;
                                    
                                    for (var m = 0; m < $scope.mealPlanNameArray
                                        .length; m++) {
                                        $scope.mealPlanNameArray[
                                            m].mealNutrition = {};
                                    }


                                }, function(response) {
                                    console.log(response);
                                });
                        };

                        //get initial data for day1 and week 1 of the plan
                        $scope.getDayPlan($scope.dayplan.day_no, $scope
                            .dayplan.week_no);

                        // function to populate additional ingredients info inside mealplan array
                        $scope.getAdditionalIngredientsInfo = function() {
                            if ($scope.mealPlanNameArray !==
                                undefined) {
                                for (var i = 0; i < $scope.mealPlanNameArray
                                    .length; i++) {
                                    if ($scope.mealPlanNameArray[i]
                                        .mealingredient !==
                                        undefined) {
                                        for (var j = 0; j < $scope.mealPlanNameArray[
                                            i].mealingredient.length; j++) {
                                            //callback function to deal with the asynchronous call within for loop
                                            (function(cntr_i,
                                                cntr_j) {
                                                $scope.mealPlanNameArray[
                                                        cntr_i]
                                                    .mealingredient[
                                                        cntr_j]
                                                    .additionalIngInfo = {};
                                                searchService.get_ingredient_addtnl_info(
                                                        $scope.mealPlanNameArray[
                                                            cntr_i
                                                        ]
                                                        .mealingredient[
                                                            cntr_j
                                                        ].ingredient
                                                        .id)
                                                    .then(
                                                        function(
                                                            response
                                                        ) {
                                                            //model for storing response from API 
                                                            $scope
                                                                .mealPlanNameArray[
                                                                    cntr_i
                                                                ]
                                                                .mealingredient[
                                                                    cntr_j
                                                                ]
                                                                .additionalIngInfo =
                                                                response;
                                                        },
                                                        function(
                                                            error
                                                        ) {
                                                            console
                                                                .log(
                                                                    error
                                                                );
                                                        });
                                            })(i, j);
                                        }
                                    }
                                }
                            }
                        };


                        $scope.$watchCollection('mealPlanNameArray',
                            function(newValue, oldValue) {
                                $scope.getAdditionalIngredientsInfo();
                            });

                        // creates an array of hours to choose from
                        $scope.addMealHours = [];
                        for (var i = 0; i <= 23; i++) {
                            $scope.addMealHours.push(i);
                        }
                        
                        // creates an array of minutes to choose from
                        $scope.addMealMinutes = [];

                        for (var j = 0; j <= 59; j++) {
                            $scope.addMealMinutes.push(j);
                        }

                        // updates name and time of a meal plan
                        $scope.updateDayMealPlan = function(index) {

                            if($scope.mealPlanNameArray[index] !== undefined )
                            {var obj = {
                                'name': $scope.mealPlanNameArray[
                                    index].mealname,
                                'time': $scope.mealPlanNameArray[
                                        index].time.getHours() +
                                    ':' + $scope.mealPlanNameArray[
                                        index].time.getMinutes()
                            };

                            planService.updateMealPlan(obj, $scope.mealPlanNameArray[
                                    index].id)
                                .then(function(response) {
                                    //console.log(response);

                                }, function(error) {
                                    console.log(error);
                                });};
                        };


                        // updates meal ingredient in a meal plan
                        $scope.updateMealIngredient = function(obj) {
                            // CONSIDER RENAMING THIS
                            var obje = {
                                'quantity': parseFloat(obj.quantity),
                                'ingredient': obj.ingredient.id,
                                'unit': obj.unit.id
                            };

                            planService.updateMealIngredient(obje,
                                    obj.id)
                                .then(function(response) {
                                    // TODO: update msg to user
                                }, function(error) {
                                    console.log(error);
                                });
                        };


                        //watch the filter and request new results as soon as filters are changed
                        $scope.$watchCollection('foodgroup', function(
                            newVal, oldVal) {
                            $scope.search(1, $scope.sortby);
                        });

                        //searches recipes or ingredients
                        //only works for ingredients right now
                        $scope.searchPlan = function(query, page,
                            sortby) {
                            $scope.query = query;
                            if (query) {
                                $scope.search(page, sortby);
                            }
                        };

                        //main search fn, executed on page change(page specifies page number to be displayed)
                        //checks whether applied sort order is same as previous sort order or not, 
                        //if not, then only make the request, if the order is same and filters are same,
                        //then do not make the request.
                        $scope.search = function(page, sortby) {
                            $scope.details = undefined;
                            if ($scope.query !== undefined) {

                                $scope.sortby = sortby;
                                $scope.ingredientInModal = $scope.ingredientInModal
                                    .concat(
                                        $scope.checklistIngs.splice(
                                            0, $scope.checklistIngs
                                            .length
                                        ));

                                var query = $scope.query;
                                console.log(query, page, sortby);
                                if (query !== undefined && $scope.foodgroup
                                    .length > 0) {
                                    searchService.search_ingredient(
                                            query, page, $scope.foodgroup,
                                            sortby)
                                        .then(function(response) {
                                            $scope.details =
                                                response;
                                            $scope.filts =
                                                response.filters; //model for storing response from API                
                                            console.log($scope.details);
                                            // pagination
                                            $scope.currentPage =
                                                page;
                                            $scope.pageSize =
                                                response.total *
                                                6;
                                        }, function(error) {
                                            console.log(error);
                                        });
                                }
                                else if (query != undefined &&
                                    $scope.foodgroup.length === 0) {
                                    searchService.search_ingredient(
                                            query, page, null,
                                            sortby)
                                        .then(function(response) {
                                            $scope.details =
                                                response;
                                            $scope.filts =
                                                response.filters; //model for storing response from API                
                                            console.log($scope.details);
                                            // pagination
                                            $scope.currentPage =
                                                page;
                                            $scope.pageSize =
                                                response.total *
                                                6;
                                        }, function(error) {
                                            console.log(error);
                                        });
                                }
                                else {
                                    searchService.search_ingredient(
                                            query, page, null,
                                            sortby)
                                        .then(function(response) {
                                            $scope.details =
                                                response;
                                            $scope.filts =
                                                response.filters; //model for storing response from API                
                                            console.log($scope.details);
                                            // pagination
                                            $scope.currentPage =
                                                page;
                                            $scope.pageSize =
                                                response.total *
                                                6;
                                        }, function(error) {
                                            console.log(error);
                                        });
                                }

                            }
                        };

                        //opens modal to add ingredients/recipes on a current mealplan
                        $scope.openCreatePlanModal = function(index) {
                            console.log('fire');
                            $('#add-food-modal')
                                .openModal();
                            $scope.currentMealPlanName = index;
                        };

                        // array to store the nutrient values in modal for every ingredient checked
                        $scope.ingredientInModal = []; //earlier called nutrientValue

                        // copies the ingredients selected in the respective meal array
                        $scope.addContents = function() {
                            // currentmealPlanname, nutrientvalue
                            // these should be used to create a post request  to create meal

                            console.log($scope.mealPlanNameArray);
                            for (var j = 0; j <
                                $scope.checklistIngs.length; j++
                            ) {
                                $scope.ingredientInModal.push(
                                    $scope.checklistIngs[j]);
                            }
                            $scope.checklistIngs = [];

                            var currlength =
                                $scope.mealPlanNameArray[$scope.currentMealPlanName]
                                .mealingredient.length;
                            //give a more sensible name to this variable
                            var x = $scope.ingredientInModal.slice();

                            for (var i = 0; i < x.length; i++) {
                                // handle case where measure is only 100g or not an array
                                if (x[i].measure.length !== 0) {
                                    $scope.mealPlanNameArray[$scope
                                            .currentMealPlanName].mealingredient
                                        .push({
                                            ingredient: x[i],
                                            unit: x[i].measure[
                                                0],
                                            quantity: 1.00,
                                        });
                                }
                                else {
                                    $scope.mealPlanNameArray[$scope
                                            .currentMealPlanName].mealingredient
                                        .push({
                                            ingredient: x[i],
                                            unit: x[i].measure,
                                            quantity: 1.00,

                                        });
                                }
                            }

                            //post ingredients to db via url endpoint
                            $scope.fillMealPlan(currlength, $scope.currentMealPlanName);
                            $scope.ingredientInModal.length = 0;
                            $('#add-food-modal')
                                .closeModal();
                        };


                        // uncheck all the selected items if save button is not clicked
                        $scope.emptyModalContents = function() {
                            $('#add-food-modal')
                                .closeModal();
                        };

                        //function to disable search result checkboxes which have already been selected
                        $scope.checkToDisable = function(index) {
                            for (var k = 0; k < $scope.mealPlanNameArray[
                                    $scope.currentMealPlanName].mealingredient
                                .length; k++) {
                                if ($scope.mealPlanNameArray[$scope
                                    .currentMealPlanName].mealingredient[
                                    k].ingredient.id === index) {
                                    return true;
                                }
                            }
                            return false;
                        };

                        // DEFAULT serving per ingredient
                        $scope.amount = 1;

                        // to fire red(-) button which removes the entire meal
                        $scope.clearMeal = function(element) {
                            var temp = $scope.mealPlanNameArray[
                                element];
                            planService.deleteMealPlan(temp.id)
                                .then(function(response) {
                                    $scope.mealPlanNameArray.splice(
                                        element, 1);
                                }, function(error) {
                                    console.log(error);
                                });
                        };

                        // adds new mealname
                        $scope.addMeal = function(key) {
                            console.log(key, $scope.dayplan);
                            var tm = key.time;
                            var mealObjToUpdate = {
                                day : $scope.dayplan.id,
                                name : key.name,
                                time : moment(tm).format('HH:mm:ss')
                            }
                            //convert to JS date format for rendering
                            var newtm = new Date(moment(tm));
                            /* update the database */
                            planService.createMealPlan(mealObjToUpdate)
                                .then(function(response) {
                                    /* update the view variables for meals */
                                    $scope.mealPlanNameArray.push({
                                        'mealname': key.name,
                                        'mealingredient': [],
                                        'time': tm,
                                        'mealrecipe': [],
                                        'id': response.mealplanid,
                                        'counter': $scope
                                            .mealPlanNameArray
                                            .length,
                                        'day': $scope.dayplanid,
                                        'mealNutrition':{}
                                    });
                                }, function(error) {
                                    console.log('cant', error);
                                });

                            $('#add-meal-modal').closeModal();
                        };

                        $scope.triggerAddMealModal = function() {
                            $('#add-meal-modal').openModal();
                        };

                        $scope.nextDayPlan = function(element) {
                            $scope.mealPlanNameArray[element] = [];
                        };

                        // removes ingredients from the modal
                        $scope.removeIngredient = function(element) {
                            var index = $scope.ingredientInModal.indexOf(
                                element);
                            $scope.ingredientInModal.splice(index,
                                1);
                        };

                        // removes ingredients which are saved in meal
                        $scope.removeIngredientsFromSavedMeal =
                            function(key, element) {

                                var temp = $scope.mealPlanNameArray[key]
                                    .mealingredient[element];
                                planService.deleteMealIngredient(temp.id)
                                    .then(function(response) {
                                        $scope.mealPlanNameArray[
                                                key].mealingredient
                                            .splice(element, 1);
                                    }, function(response) {
                                        console.log(response);
                                    });
                            };


                         /* Calculates total value of a nutrient across a days plan */
                       $scope.calcDayNutrientVal = function(nutrient,isAdditional){
                            var total = 0;
                            if ($scope.mealPlanNameArray) {
                                for (var i = 0; i < $scope.mealPlanNameArray
                                    .length; i++) {
                                    for (var j = 0; j < $scope.mealPlanNameArray[
                                        i].mealingredient.length; j++) {
                                        if (isAdditional) {
                                            
                                            /* check if additional ingredient info has been created or not */
                                            if ($scope.mealPlanNameArray[
                                                    i].mealingredient[
                                                    j] !==
                                                undefined && $scope.mealPlanNameArray[
                                                    i].mealingredient[
                                                    j].additionalIngInfo !==
                                                undefined) {
                                                total += parseFloat(
                                                        $scope.mealPlanNameArray[
                                                            i].mealingredient[
                                                            j].additionalIngInfo[
                                                            nutrient
                                                        ]) *
                                                    parseFloat(
                                                        $scope.mealPlanNameArray[
                                                            i].mealingredient[
                                                            j].quantity
                                                    ) * parseFloat(
                                                        $scope.mealPlanNameArray[
                                                            i].mealingredient[
                                                            j].unit
                                                        .weight) /
                                                    100;
                                            }
                                            else {
                                                total += 0;
                                            }
                                        }
                                        else {
                                            total += parseFloat(
                                                    $scope.mealPlanNameArray[
                                                        i].mealingredient[
                                                        j].ingredient[
                                                        nutrient]) *
                                                parseFloat($scope.mealPlanNameArray[
                                                    i].mealingredient[
                                                    j].quantity) *
                                                parseFloat($scope.mealPlanNameArray[
                                                    i].mealingredient[
                                                    j].unit.weight) /
                                                100;

                                        }
                                    }

                                }
                            }
                            return total;
                        };

                        /* function to calculate global macronutritients of a given day of 
                            a plan */
                        $scope.calculateGlobalMacros = function(field) {

                            var GlobalTotal = 0;

                            if (!$scope.mealPlanNameArray) {
                                return;
                            }
                            else {
                                for (i = 0; i < $scope.mealPlanNameArray
                                    .length; i++) {
                                    var mealTotal = 0;
                                    for (j = 0; j < $scope.mealPlanNameArray[
                                        i].mealingredient.length; j++) {
                                        mealTotal +=
                                            parseFloat($scope.mealPlanNameArray[
                                                    i].mealingredient[
                                                    j]
                                                .ingredient[field]);
                                    }
                                   
                                  GlobalTotal += mealTotal;
                                  if($scope.mealPlanNameArray[i].mealNutrition !==undefined)
                                 { $scope.mealPlanNameArray[i].mealNutrition[field] = mealTotal;}
                            }  

                            }

                            return GlobalTotal;
                        };



                         $scope.calcMealNutrientVal = function(index, nutrient, isAdditional){
                             var total = [];
                            if($scope.mealPlanNameArray){
                               for (var i=0; i< $scope.mealPlanNameArray.length;i++) {
                                   var q = 0;
                                   for (var j = 0 ; j < $scope.mealPlanNameArray[i].mealingredient.length ; j++) {
                                       if (isAdditional && $scope.mealPlanNameArray[i].mealingredient[j].additionalIngInfo !== undefined){
                                           if($scope.mealPlanNameArray[i].mealingredient[j].additionalIngInfo[nutrient] !== null){
                                   q += parseFloat($scope.mealPlanNameArray[i].mealingredient[j].additionalIngInfo[nutrient])
                                        * parseFloat($scope.mealPlanNameArray[i].mealingredient[j].quantity)
                                    * parseFloat($scope.mealPlanNameArray[i].mealingredient[j].unit.weight)/100;
                                   }
                                    else {
                                        q +=0;
                                    }
                                       }
                                    else {
                                        q += parseFloat($scope.mealPlanNameArray[i].mealingredient[j].ingredient[nutrient])
                                        * parseFloat($scope.mealPlanNameArray[i].mealingredient[j].quantity)
                                    * parseFloat($scope.mealPlanNameArray[i].mealingredient[j].unit.weight)/100;
                                    }
                                   }
                                   total.push(q); 

                               }
                             return total[index];
                                                               }


                            };
                

                        //function to create meal ingredients related to given mealplan
                        $scope.fillMealPlan = function(ind, current) {
                            var temp = $scope.mealPlanNameArray[
                                current].mealingredient;

                            for (var i = ind; i < temp.length; i++) {
                                // CONSIDER RENAMING THIS HORRIBLY NAMED OBJECT
                                var obj = {
                                    'ingredient': temp[i].ingredient
                                        .id,
                                    'meal_plan': $scope.mealPlanNameArray[
                                        current].id,
                                    'quantity': parseFloat(temp[
                                        i].quantity),
                                    'unit': temp[i].unit.id
                                };

                                (function(cntr, obj) {
                                    // here the value of i was passed into as the argument cntr
                                    // and will be captured in this function closure so each
                                    // iteration of the loop can have it's own value
                                    planService.createMealIngredient(
                                            obj)
                                        .then(
                                            function(response) {
                                                //                                            console.log(response, cntr);
                                                $scope.mealPlanNameArray[
                                                        current
                                                    ].mealingredient[
                                                        cntr].id =
                                                    response.meal_ingredient_id;

                                            },
                                            function(error) {
                                                console.log(
                                                    error);
                                            }
                                        );

                                })(i, obj);


                            }
                        };

                         $scope.openMealInfoModal = function(index) {
                                $('#meal-info-modal').openModal();
                                $scope.selected = index;
                            };
                    }
                    else {
                        $location.path('/');
                    }
                },
                function(error) {
                    console.log(error);
                    $location.path('/');
                });
    }
]);