

/* Angular Controller for summary tab on dashboard. Allows a user to check followed items of a plan */

app.controller('summaryCtrl', ['$scope', 'summaryService', 'searchService',
    function($scope, summaryService, searchService) {
        $scope.plan_data = [];
                                $scope.checklistIngs = [];
         $scope.ingredientInModal = [];
        $scope.foodgroup = [];
        $scope.currentMealPlanName=-1;
        
        $scope.$watch('currentMealPlanName', function(newVal, oldVal){
            console.log("NewVA : " + newVal);
            console.log("OLD VA : " + oldVal);
        })
        $scope.today = moment();
        $scope.navDates = {
            current: moment(),
            next: moment()
                .add(1, "days"),
            prev: moment()
                .subtract(1, "days")
        }
        $scope.navTitles = {
            current: "Today",
            prev: "Yesterday",
            next: "Tomorrow"
        }
        
        /* array to maintain a list of checked ingredients */
        $scope.checklistIngredients = [];
        
        /* watch the array of checked ingredients. if anything changes
           update that particular change */
        $scope.$watchCollection('checklistIngredients', function(newVal,
                oldVal) {
                var diffIncrease = newVal.filter(function(obj) {
                    return !oldVal.some(function(obj2) {
                        return obj === obj2;
                    });
                });
            
                var diffDecrease = oldVal.filter(function(obj) {
                    return !newVal.some(function(obj2) {
                        return obj === obj2;
                    });
                });
                console.log(diffIncrease);
                console.log(diffDecrease);
                if(diffIncrease.length>0){
                    for (var i = 0; i < diffIncrease.length; i++) {                    
                        var id = diffIncrease[i].id;
                        var objToUpdate = {
                            is_checked: true,
                            quantity: diffIncrease[i].quantity
                        };
                        (function(objToUpdate, id) {
                            summaryService.updateEventIngredient(
                                objToUpdate, id);
                        })(objToUpdate, id)
                    }
                }else if(diffDecrease.length > 0){
                    for (var i = 0; i < diffDecrease.length; i++) {                    
                        var id = diffDecrease[i].id;
                        var objToUpdate = {
                            is_checked: false,
                            quantity: diffDecrease[i].quantity
                        };
                        (function(objToUpdate, id) {
                            summaryService.updateEventIngredient(
                                objToUpdate, id);
                        })(objToUpdate, id)
                    }
                }
            })
        
        
        $scope.updateMealIngredientCheck = function(ingredient){
            var id = ingredient.id;
            var objToUpdate = {
                is_checked: ingredient.is_checked
            };
        }
        
        $scope.updateMealIngredientQuantity = function(ingredient){
            var id = ingredient.id;
            var objToUpdate = {
                quantity: ingredient.quantity
            };
            console.log(id);
            console.log(objToUpdate);
            summaryService.updateEventIngredient(objToUpdate, id);
        }
            //function to retrieve a particular days diet plan
        $scope.getDayPlan = function(dateString) {
            console.log("caller is " + arguments.callee.caller.toString());;
            summaryService.getUserDayPlan(dateString)
                .then(function(response) {
                    $scope.plan_data = response;
                    for (var i = 0; i < $scope.plan_data.length; i++) {
                        for (var j = 0; j < $scope.plan_data[i]
                            .followingMealPlanIngredient.length; j++
                        ) {
                            $scope.plan_data[i].followingMealPlanIngredient[j].quantity = parseFloat($scope.plan_data[i].followingMealPlanIngredient[j].quantity);
                            console.log("UPDATING > > > ");
                            if ($scope.plan_data[i].followingMealPlanIngredient[
                                j].is_checked) {
                                $scope.checklistIngredients.push(
                                    $scope.plan_data[i].followingMealPlanIngredient[
                                        j]);
                            }
                        }
                    }
                    console.log(response);

                    console.log(response);
                }, function(error) {
                    console.log(error);
                });
        }

        var dateString = $scope.today.format('YYYY-MM-DD');
        $scope.getDayPlan(dateString);


        $scope.getNextDay = function(direction) {
            console.log($scope.navDates);
            if (direction === 1) {
                $scope.navDates.current.add(1, "days");
                $scope.navDates.next.add(1, "days");
                $scope.navDates.prev.add(1, "days");
            }
            else if (direction === -1) {
                $scope.navDates.current.subtract(1, "days");
                $scope.navDates.next.subtract(1, "days");
                $scope.navDates.prev.subtract(1, "days");
            }
            $scope.checkNavTitle();
            $scope.getDayPlan($scope.navDates.current.format(
                'YYYY-MM-DD'));
        }

        /*check whether selected date is same as today, 
    yesterday or tomorrow and set titles accordingly*/
        $scope.checkNavTitle = function() {
            console.log("today : " + $scope.today.format(
                'YYYY-MM-DD'));
            console.log("currdate : " + $scope.navDates.current.format(
                'YYYY-MM-DD'));
            var diff = Math.round($scope.today.diff($scope.navDates
                .current, 'days', true));
            console.log(diff);
            if (diff === 0) {
                $scope.navTitles = {
                    current: "Today",
                    prev: "Yesterday",
                    next: "Tomorrow"
                }
            }
            else if (diff === -1) {
                $scope.navTitles = {
                    current: "Tomorrow",
                    prev: "Today",
                    next: $scope.navDates.next.format(
                        'YYYY-MM-DD')
                }
            }
            else if (diff === 1) {
                $scope.navTitles = {
                    current: "Yesterday",
                    prev: $scope.navDates.prev.format(
                        'YYYY-MM-DD'),
                    next: "Today"
                }
            }
            else if (diff === -2) {
                $scope.navTitles = {
                    current: $scope.navDates.current.format(
                        'YYYY-MM-DD'),
                    prev: "Tomrrow",
                    next: $scope.navDates.next.format(
                        'YYYY-MM-DD')
                }
            }
            else if (diff === 2) {
                $scope.navTitles = {
                    current: $scope.navDates.current.format(
                        'YYYY-MM-DD'),
                    prev: $scope.navDates.prev.format(
                        'YYYY-MM-DD'),
                    next: "Yesterday"
                }
            }
            else {
                $scope.navTitles = {
                    current: $scope.navDates.current.format(
                        'YYYY-MM-DD'),
                    prev: $scope.navDates.prev.format(
                        'YYYY-MM-DD'),
                    next: $scope.navDates.next.format(
                        'YYYY-MM-DD')
                }
            }
        }
        
                //opens modal to add ingredients/recipes on a current mealplan
        $scope.openCreatePlanModal = function(index) {
             $scope.currentMealPlanName = index;
            console.log($scope.currentMealPlanName);
            $('#add-food-modal')
                .openModal();
           
        };
        
         $scope.removeIngredientsFromSavedMeal =
                            function(key1, key2) {
                                var temp = $scope.plan_data[key1]
                                    .followingMealPlanIngredient[key2].ingredient;
                            console.log(temp);
                               summaryService.deleteMealIngredient(temp.id)
                                    .then(function(response) {
                                        $scope.plan_data[
                                                key1].followingMealPlanIngredient.splice(key2, 1);
                                
                                    }, function(response) {
                                        console.log(response);
                                    });
                            };
        
                $scope.search = function(page, sortby) {
                        $scope.details = undefined;
                        if($scope.query!==undefined){

                        $scope.sortby = sortby;
                        $scope.ingredientInModal = $scope.ingredientInModal.concat(
                                                        $scope.checklistIngs.splice(0,$scope.checklistIngs.length
                                                        ));
                        
                        var query = $scope.query;
                        console.log(query, page, sortby);
                        if (query !==undefined && $scope.foodgroup.length >0) {
                            searchService.search_ingredient(query, page, $scope.foodgroup, sortby)
                                .then(function(response) {
                                    $scope.details = response;
                                    $scope.filts = response.filters; //model for storing response from API                
                                    console.log($scope.details);
                                    // pagination
                                    $scope.currentPage = page;
                                    $scope.pageSize = response.total*6;
                                }, function(error) {
                                    console.log(error);
                                });
                        }
                        else if (query != undefined && $scope.foodgroup.length ===0) {
                            searchService.search_ingredient(query, page, null, sortby)
                                .then(function(response) {
                                    $scope.details = response;
                                    $scope.filts = response.filters; //model for storing response from API                
                                    console.log($scope.details);
                                    // pagination
                                    $scope.currentPage = page;
                                    $scope.pageSize = response.total*6;
                                }, function(error) {
                                    console.log(error);
                                });
                        }
                        else{
                            searchService.search_ingredient(query, page, null, sortby)
                                .then(function(response) {
                                    $scope.details = response;
                                    $scope.filts = response.filters; //model for storing response from API                
                                    console.log($scope.details);
                                    // pagination
                                    $scope.currentPage = page;
                                    $scope.pageSize = response.total*6;
                                }, function(error) {
                                    console.log(error);
                                });
                        }

                        }
                    };

         $scope.searchPlan = function(query, page, sortby) {
                console.log($scope.currentMealPlanName);
                            $scope.query = query;
                            if (query) {
                                $scope.search(page, sortby);
                            }
                        };
        
                $scope.addContents = function() {
                            // currentmealPlanname, nutrientvalue
                            // these should be used to create a post request  to create meal
                            // THIS SHOULD BE SHORTER
                            for (var j = 0; j <
                            $scope.checklistIngs.length; j++
                        ) {
                            $scope.ingredientInModal.push(
                                $scope.checklistIngs[j]);
                        }
                        $scope.checklistIngs = [];

                            var currlength =
                                $scope.plan_data[$scope.currentMealPlanName].followingMealPlanIngredient.length;
                                
                            //give a more sensible name to this variable
                            var x = $scope.ingredientInModal.slice();
            
                            //STRANGE LOOKING FOR LOOP
                            for (var i = 0; i < x.length; i++) {
                                // handle case where measure is only 100g or not an array
                                if (x[i].measure.length !== 0) {
                                    $scope.plan_data[$scope
                                            .currentMealPlanName].followingMealPlanIngredient
                                        .push({
                                            ingredient: x[i],
                                            unit: x[i].measure[
                                                0],
                                            quantity: 1.00,
                                        })
                                }
                                else {
                                    $scope.plan_data[$scope
                                            .currentMealPlanName].followingMealPlanIngredient
                                        .push({
                                            ingredient: x[i],
                                            unit: x[i].measure,
                                            quantity: 1.00,

                                        });
                                }
                                console.log($scope.plan_data);
                            }

                            //post ingredients to db via url endpoint
                            $scope.fillMealPlan(currlength, $scope.currentMealPlanName);
                            $scope.ingredientInModal.length = 0;
                            $('#add-food-modal')
                                .closeModal();
                        };
        
                    // TBD
                    $scope.fillMealPlan = function(ind, current) {
                            var temp = $scope.plan_data[
                                current].followingMealPlanIngredient;

                            console.log($scope.plan_data);
                            console.log(temp);
                            for (var i = ind; i < temp.length; i++) {
                                var saveind = i;
                                // CONSIDER RENAMING THIS HORRIBLY NAMED OBJECT
                                var obj = {
                                    'ingredient': temp[i].ingredient
                                        .id,
                                    'meal_plan': $scope.plan_data[current].user_mealplan,
                                    'quantity': parseFloat(temp[
                                        i].quantity),
                                    'unit': temp[i].unit.id
                                };

                                (function(cntr, obj){
                                        // here the value of i was passed into as the argument cntr
                                        // and will be captured in this function closure so each
                                        // iteration of the loop can have it's own value
                                        summaryService.updateEventIngredient(
                                        obj)
                                    .then(
                                        function(response) {
                                            console.log(response, cntr);
//                                            $scope.plan_data[current]
//                                                .followingMealPlanIngredient[cntr] =
//                                                response.meal_ingredient_id;

                                        },
                                        function(error) {
                                            console.log(error);
                                        }
                                    );
                                        
                                    })(i, obj);

                                
                            }
                        };


        // Add Hours and Minutes for a meal time
        $scope.addMealHours = [];
        // WHAT DOES THIS LOOP DO?
        for (var i = 0; i <= 23; i++) {
            $scope.addMealHours.push(i);
        }

        $scope.addMealMinutes = [];

        for (var j = 0; j <= 59; j++) {
            $scope.addMealMinutes.push(j);
        }

        // adds new mealname
        $scope.addMeal = function(key) {
            key.day = $scope.navDates.current;
            var tm = key.time;
            key.time = key.time.getHours() + ":" +
                key.time.getMinutes() + ":00";
            

            $('#add-meal-modal')
                .closeModal();
        };


    }
]);