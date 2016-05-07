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

                        /* main object storing the plan data */
                       
                        
                        /* week & day count for current plan */
                        $scope.weekCount = [];
                        $scope.dayCount = [];

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
                                    $scope.plan.duration)

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
                        $scope.updateDayPlan = function(param, val) {

                            /*if possible, write a shorter function using modulo operator
                            days increase all the time */
                            $scope.dayplan[param] += parseInt(val);
                            if ($scope.dayplan['day_no'] > 7 *
                                $scope.plan.duration) {
                                $scope.dayplan['day_no'] = 1;
                            }
                            if ($scope.dayplan['week_no'] > $scope.plan
                                .duration) {
                                $scope.dayplan['week_no'] = 1;
                            }
                            else if ($scope.dayplan['week_no'] < 1) {
                                $scope.dayplan['week_no'] = $scope.plan
                                    .duration;
                            }

                            $scope.getDayPlan($scope.dayplan.day_no,
                                $scope.dayplan.week_no);

                        }
                        $scope.displayHeight = function(stringHeight) {
                            /* Display the height of a person for whom 
                            this plan is created */
                            if (stringHeight === 0) {
                                $scope.feet = 1;
                                $scope.inches = 0;
                                $scope.unit = string;
                            }
                            else {
                                $scope.metric = 1;
                                $scope.unit = string;
                            }
                        };


                        /* phase of the day */
                        $scope.amPmArray = ["AM", "PM"];

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

                        // FIGURE OUT WHAT THIS DOES
                        $scope.addMealHours = [];
                        // WHAT DOES THIS LOOP DO?
                        for (var i = 0; i <= 23; i++) {
                            $scope.addMealHours.push(i);
                        }

                        $scope.addMealMinutes = [];

                        for (var j = 0; j <= 59; j++) {
                            $scope.addMealMinutes.push(j);
                        }

                        // WHAT DO THESE DO?
                        $scope.mealEdit = null;
                        // WHAT DO THESE DO?
                        $scope.updateDayMealPlan = function(index) {
                            var obj = {
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
                                });
                        };


                        // YEH KYA HAI?
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
//                                    console.log(response);
                                }, function(error) {
                                    console.log(error);
                                });
                        };

                        //searches recipes or ingredients
                        //only works for ingredients right now
                        $scope.searchPlan = function(query) {
                            if (query) {
                                searchService.search_ingredient(query)
                                    .then(function(response) {
                                        $scope.details =
                                            response; //model for storing response from API 
                                    }, function(error) {
                                        console.log(error);
                                    });
                            }
                        };

                        //opens modal to add ingredients/recipes on a current mealplan
                        $scope.openCreatePlanModal = function(index) {
                            $('#create-plan-modal')
                                .openModal();
                            $scope.currentMealPlanName = index;
                        };

                        // array to store the nutrient values in modal for every ingredient checked
                        $scope.nutrientValue = [];

                        // copies the ingredients selected in the respective meal array
                        $scope.addContents = function() {
                            // currentmealPlanname, nutrientvalue
                            // these should be used to create a post request  to create meal
                            // THIS SHOULD BE SHORTER
                            var currlength =
                                $scope.mealPlanNameArray[$scope.currentMealPlanName]
                                .mealingredient.length;
                            //give a more sensible name to this variable
                            var x = $scope.nutrientValue.slice();
//                            console.log(currlength);

                            //STRANGE LOOKING FOR LOOP
                            for (var i = 0; i < x.length; i++) {
                                if (x[i].measure.length !== 0) {
                                    $scope.mealPlanNameArray[$scope
                                            .currentMealPlanName].mealingredient
                                        .push({
                                            ingredient: x[i],
                                            unit: x[i].measure[
                                                0],
                                            quantity: 1.00,
                                        })
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
                            $scope.nutrientValue.length = 0;
                            $('#create-plan-modal')
                                .closeModal();
                        };


                        // uncheck all the selected items if save button is not clicked
                        $scope.emptyModalContents = function() {
                            $('#create-plan-modal')
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
                            key.day = $scope.dayplan.id;
                            var tm = key.time;
                            key.time = key.time.getHours() + ":" +
                                key.time.getMinutes() + ":00";
                            planService.createMealPlan(key)
                                .then(function(response) {
                                    $scope.mealPlanNameArray.push({
                                        'mealname': key
                                            .name,
                                        'mealingredient': [],
                                        'time': tm,
                                        'mealrecipe': [],
                                        'id': response.mealplanid,
                                        'counter': $scope
                                            .mealPlanNameArray
                                            .length,
                                        'day': $scope.dayplan
                                            .id
                                    });
                                }, function(error) {
                                    console.log('cant', error);
                                });

                            $('#add-meal-modal')
                                .closeModal();
                        };

                        //AGAIN - DO WE REALLY NEED JQUERY HERE??
                        $scope.triggerAddMealModal = function() {
                            $('#add-meal-modal')
                                .openModal();
                        };

                        $scope.nextDayPlan = function(element) {
                            $scope.mealPlanNameArray[element] = [];
                        };

                        // removes ingredients from the modal
                        $scope.removeIngredient = function(element) {
                            var index = $scope.nutrientValue.indexOf(
                                element);
                            $scope.nutrientValue.splice(index, 1);
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

                        $scope.calculateTotalInfo = function(index,
                            field) {
                            var total = 0;
                            for (i = 0; i < $scope.mealPlanNameArray[
                                index].mealingredient.length; i++) {
                                total += parseFloat($scope.mealPlanNameArray[
                                        index].mealingredient[i]
                                    .ingredient[field]);
                            }
                            return total;

                        };

                        $scope.calculateGlobalMacros = function(field) {

                            var GlobalTotal = 0;
                            
                            if(!$scope.mealPlanNameArray) {
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
                                                i].mealingredient[j]
                                            .ingredient[field]);
                                }
                                  GlobalTotal += mealTotal;
                                  $scope.mealPlanNameArray[i].mealNutrition[field] = mealTotal;
                                  console.log($scope.mealPlanNameArray[i]);
                            }  
                            }
                            
                            return GlobalTotal;
                        };

                        //function to get current dayplan details including all meals and mealings
                        // TODO: update for API
                        $scope.getDayPlan = function(day, week) {
                            var id = $routeParams.id;
                            planService.getdayplan(id, day, week)
                                .then(function(response) {
                                    for (var i = 0; i <
                                        response.mealplan.length; i++
                                    ) {
                                        response.mealplan[i].mealname =
                                            response.mealplan[i]
                                            .name;
                                        delete response.mealplan[
                                            i].name;
                                        var dateStr =
                                            "July 21, 1983 " +
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
                                    for(var i=0; i< $scope.mealPlanNameArray.length; i++){
                                        $scope.mealPlanNameArray[i].mealNutrition = {};
                                    }
                                        
                                google.charts.load('current', {'packages':['corechart']});

                                  // Set a callback to run when the Google Visualization API is loaded.
                                  google.charts.setOnLoadCallback(drawChart);

                                  // Callback that creates and populates a data table,
                                  // instantiates the pie chart, passes in the data and
                                  // draws it.

                                    $scope.extractComponent =[];
                                    for(var i=0; i<$scope.mealPlanNameArray.length; i++){
//                                        console.log($scope.mealPlanNameArray[i]);
                                        var total=0;
                                        for (var j=0; j<$scope.mealPlanNameArray[i].mealingredient.length; j++){
                                            total +=
                                                parseFloat($scope.mealPlanNameArray[
                                                    i].mealingredient[j]
                                                .ingredient['energy_kcal']);
                                        }
//                                        console.log(total);
                                        $scope.extractComponent.push([$scope.mealPlanNameArray[i].mealname, total]);
                                    }
                                
                                    $scope.extractComponent.push(['Total', $scope.calculateGlobalMacros('energy_kcal')]);
                                  function drawChart() {

                                    // Create the data table.
                                    var data = new google.visualization.DataTable();
                                    data.addColumn('string', 'Topping');
                                    data.addColumn('number', 'Kcal');
                                    console.log($scope.extractComponent);
                                    data.addRows($scope.extractComponent);

                                    // Set chart options
                                   var options = {
                                    chartArea: {width: '50%'},
                                    hAxis: {
                                      minValue: 0,
                                      gridlines: {
                                        color: 'none'
                                }
                                    },
                                    vAxis: {
                                      minValue: 0,
                                    gridlines: {
                                        color: 'none'
                                }

                                    },
                                       colors: ['green'],
                                  };
                                      

                                    // Instantiate and draw our chart, passing in some options.
                                    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
                                    chart.draw(data, options);
                                  }
                                
                                }, function(response) {
                                    console.log(response);
                                });
                        };

                        //get initial data for day1 and week 1 of the plan
                        $scope.getDayPlan($scope.dayplan.day_no, $scope
                            .dayplan.week_no);

                        //function to create meal ingredients related to given mealplan
                        $scope.fillMealPlan = function(ind, current) {
                            var temp = $scope.mealPlanNameArray[
                                current].mealingredient;

                            for (var i = ind; i < temp.length; i++) {
                                var saveind = i;
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

                                (function(cntr, obj){
                                        // here the value of i was passed into as the argument cntr
                                        // and will be captured in this function closure so each
                                        // iteration of the loop can have it's own value
                                        planService.createMealIngredient(
                                        obj)
                                    .then(
                                        function(response) {
                                            console.log(response, cntr);
                                            $scope.mealPlanNameArray[
                                                    current].mealingredient[cntr].id =
                                                response.meal_ingredient_id;

                                        },
                                        function(error) {
                                            console.log(error);
                                        }
                                    );
                                        
                                    })(i, obj);

                                
                            }
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
        
//
//     $scope.extractComponent =[];
//                                    for(var i=0; i<$scope.mealPlanNameArray.length; i++){
////                                        console.log($scope.mealPlanNameArray[i]);
//                                        var total=0;
//                                        for (var j=0; j<$scope.mealPlanNameArray[i].mealingredient.length; j++){
//                                            total +=
//                                                parseFloat($scope.mealPlanNameArray[
//                                                    i].mealingredient[j]
//                                                .ingredient['energy_kcal']);
//                                        }
////                                        console.log(total);
//                                        $scope.extractComponent.push([$scope.mealPlanNameArray[i].mealname, total]);
//                                    }
//        
//        $scope.progress = function(percent, element) {
//				var progressBarWidth = percent * element.width() / 100;
//				// With labels:
//				element.find('div').animate({ width: progressBarWidth }, 500).html(percent + "%&nbsp;");
//				
//				// Without labels:
//				//element.find('div').animate({ width: progressBarWidth }, 500);
//			}
//			
//			$(document).ready(function() { 
//				$('.progressBar').each(function() { 
//					//alert('Hello');
//					var bar = $(this);
//					var max = $(this).attr('id');
//					max = max.substring(3);
//
//					$scope.progress(max, bar);
//				});
//			});
    }
]);