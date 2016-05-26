/* Angular Controller for summary tab on dashboard. Allows a user to check followed items of a plan */

app.controller('summaryCtrl', ['$scope', 'summaryService', 'searchService',
    function($scope, summaryService, searchService) {
        $scope.plan_data = [];
        $scope.plan_summary = [];
        $scope.checklistIngs = [];
        $scope.ingredientInModal = [];
        $scope.foodgroup = [];
        $scope.currentMealPlanName = -1;

        $scope.today = moment();

        var contextDate = moment();


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
        
        

        /*check whether selected date is same as today, 
        yesterday or tomorrow and set titles accordingly*/
        $scope.checkNavTitle = function() {
            var diff = Math.round($scope.today.diff($scope.navDates
                .current, 'days', true));
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



        // array to store modal ingredients to add
        $scope.MealIngredients2Add = [];

        /* array to maintain a list of checked ingredients */
        $scope.checklistIngredients = [];
        $scope.checklistRecipes = [];
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
            
            if (diffIncrease.length > 0) {
                for (var i = 0; i < diffIncrease.length; i++) {
                    var id = diffIncrease[i].id;
                    var objToUpdate = {
                        is_checked: true,
                        quantity: diffIncrease[i].quantity,
                        unit_desc: diffIncrease[i].unit_desc.id
                    };
                    (function(objToUpdate, id) {
                        summaryService.updateEventIngredient(
                            objToUpdate, id).then(function(response){
                            $scope.updatePlanDataIngredients(id, objToUpdate);    
                        }, function(error){
                            console.log(error);
                        });
                    })(objToUpdate, id)
                }
            }
            else if (diffDecrease.length > 0) {
                for (var i = 0; i < diffDecrease.length; i++) {
                    var id = diffDecrease[i].id;
                    var objToUpdate = {
                        is_checked: false,
                        quantity: diffDecrease[i].quantity,
                        unit_desc: diffDecrease[i].unit_desc.id
                    };
                    (function(objToUpdate, id) {
                        summaryService.updateEventIngredient(
                            objToUpdate, id).then(function(response){
                            $scope.updatePlanDataIngredients(id, objToUpdate);
                        }, function(error){
                            console.log(error);
                        });
                    })(objToUpdate, id)
                }
            }
        });

        
         /* watch the array of checked recipes. if anything changes
           update that particular change */
        $scope.$watchCollection('checklistRecipes', function(newVal,
            oldVal) {
            var diffIncrease = newVal.filter(function(obj) {
                return !oldVal.some(function(obj2) {
                    return obj === obj2;
                });
            });

            console.log(newVal);
            console.log(oldVal);
            var diffDecrease = oldVal.filter(function(obj) {
                return !newVal.some(function(obj2) {
                    return obj === obj2;
                });
            });
            
            if (diffIncrease.length > 0) {
                for (var i = 0; i < diffIncrease.length; i++) {
                    var id = diffIncrease[i].id;
                    var objToUpdate = {
                        is_checked: true,
                        no_of_servings: diffIncrease[i].no_of_servings,
                    };
                    (function(objToUpdate, id) {
                        summaryService.updateEventRecipe(
                            objToUpdate, id).then(function(response){
                            $scope.updatePlanDataRecipes(id, objToUpdate);    
                        }, function(error){
                            console.log(error);
                        });
                    })(objToUpdate, id)
                }
            }
            else if (diffDecrease.length > 0) {
                for (var i = 0; i < diffDecrease.length; i++) {
                    var id = diffDecrease[i].id;
                    var objToUpdate = {
                        is_checked: false,
                        no_of_servings: diffDecrease[i].no_of_servings
                    };
                    (function(objToUpdate, id) {
                        summaryService.updateEventRecipe(
                            objToUpdate, id).then(function(response){
                            $scope.updatePlanDataRecipes(id, objToUpdate);
                        }, function(error){
                            console.log(error);
                        });
                    })(objToUpdate, id)
                }
            }
        });
        
        
        /* find index of element in array with property*/
        function findWithAttr(array, attr, value) {
            for(var i = 0; i < array.length; i += 1) {
                if(array[i][attr] === value) {
                    return i;
                }
            }
        }

        
        $scope.updatePlanDataIngredients = function(id, obj){
            var ingred2Update = []
            console.log('updating ingredients in plan Data');
            for(var i=0; i< $scope.plan_data.length; i++){
                ingred2Update = $scope.plan_data[i].followingMealPlanIngredient
                .filter(function(el){
                    return el.id == id
                });
                if(ingred2Update.length !== 0){
                    var tmp = findWithAttr($scope.plan_data[i].followingMealPlanIngredient, 
                                          'id', id);
                    $scope.plan_data[i].followingMealPlanIngredient[tmp].is_checked = 
                        obj.is_checked;
                    $scope.plan_data[i].followingMealPlanIngredient[tmp].quantity = 
                        obj.quantity;
                }
            }
            
        }

        
        $scope.updatePlanDataRecipes = function(id, obj){
            var ingred2Update = []
            console.log('updating recipe in plan data')
            for(var i=0; i< $scope.plan_data.length; i++){
                recipe2Update = $scope.plan_data[i].followingMealPlanRecipe
                .filter(function(el){
                    return el.id == id
                });
                if(recipe2Update.length !== 0){
                    var tmp = findWithAttr($scope.plan_data[i].followingMealPlanRecipe, 
                                          'id', id);
                    $scope.plan_data[i].followingMealPlanRecipe[tmp].is_checked = 
                        obj.is_checked;
                    $scope.plan_data[i].followingMealPlanRecipe[tmp].no_of_servings = 
                        obj.no_of_servings;
                }
            }
            
        }
        
        $scope.updateMealIngredientCheck = function(ingredient) {
            var id = ingredient.id;
            var objToUpdate = {
                is_checked: ingredient.is_checked
            };
        }

        $scope.updateMealIngredientQuantity = function(ingredient) {
                var id = ingredient.id;
                var objToUpdate = {
                    quantity: ingredient.quantity
                };
                summaryService.updateEventIngredient(objToUpdate, id);
            }
        
        $scope.updateMealIngredientMeasure = function(ingredient){
            var id = ingredient.id;
            var objToUpdate = {
                unit_desc: ingredient.unit_desc.id
            }
            summaryService.updateEventIngredient(objToUpdate, id);
        }
        
        
        $scope.updateMealRecipe = function(recipe){
            var id = recipe.id;
            var objToUpdate = {
                no_of_servings: recipe.no_of_servings,
                is_checked: recipe.is_checked
            }
            
            summaryService.updateEventRecipe(objToUpdate, id).then(function(response){
                console.log(response);   
            }, function(error){
                console.log(error);
            });
        }
            //function to retrieve a particular days diet plan
        $scope.getDayPlan = function(dateString) {
            $scope.plan_data = [];
            $scope.plan_summary = []
            summaryService.getUserDayPlan(dateString)
                .then(function(response) {
                    $scope.plan_data = response;
                    for (var i = 0; i < $scope.plan_data.length; i++) {
                        
                        /* correct number formats for the page */
                        for (var j = 0; j < $scope.plan_data[i]
                            .followingMealPlanIngredient.length; j++
                        ) {
                            $scope.plan_data[i].followingMealPlanIngredient[
                                j].quantity = parseFloat(
                                $scope.plan_data[i].followingMealPlanIngredient[
                                    j].quantity);
                            if ($scope.plan_data[i].followingMealPlanIngredient[
                                j].is_checked) {
                                $scope.checklistIngredients.push(
                                    $scope.plan_data[i].followingMealPlanIngredient[
                                        j]);
                            }
                        }
                        
                        for (var j = 0; j < $scope.plan_data[i]
                            .followingMealPlanRecipe.length; j++
                        ) {
                            $scope.plan_data[i].followingMealPlanRecipe[j].no_of_servings = 
                                parseFloat($scope.plan_data[i]
                                           .followingMealPlanRecipe[j]
                                           .no_of_servings);
                            if ($scope.plan_data[i].followingMealPlanRecipe[
                                j].is_checked) {
                                $scope.checklistRecipes.push(
                                    $scope.plan_data[i].followingMealPlanRecipe[
                                        j]);
                            }
                        }
                    }

                }, function(error) {
                    console.log(error);
                });
            
            summaryService.getUserCurrentDietplan(dateString)
                .then(function(response){
                $scope.plan_summary = response[0];
            }, function(error){
                console.log(error);
            })
        }


        // check if we are being redirected from the calendar page
        if ($scope.tab.dateClick != undefined) {
            $scope.navDates = {
                current: moment($scope.tab.dateClick),
                next: moment($scope.tab.dateClick)
                    .add(1, "days"),
                prev: moment($scope.tab.dateClick)
                    .subtract(1, "days")
            }
            contextDate = moment($scope.tab.dateClick);
            $scope.checkNavTitle();
            $scope.getDayPlan(contextDate.format('YYYY-MM-DD'));
        }

        $scope.getDayPlan(contextDate.format('YYYY-MM-DD'));

        $scope.getNextDay = function(direction) {
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



        //opens modal to add ingredients/recipes on a current mealplan
        $scope.openCreatePlanModal = function(index) {
            $scope.currentMealPlanName = index;
            $('#add-food-modal')
                .openModal();

        };

        $scope.removeIngredientsFromSavedMeal =
            function(key1, key2) {
                var temp = $scope.plan_data[key1]
                    .followingMealPlanIngredient[key2].id;
                summaryService.deleteMealIngredient(temp)
                    .then(function(response) {
                        $scope.plan_data[
                            key1].followingMealPlanIngredient.splice(
                            key2, 1);

                    }, function(response) {
                        console.log(response);
                    });
            };

        $scope.search = function(page, sortby) {
            $scope.details = undefined;
            if ($scope.query !== undefined) {

                $scope.sortby = sortby;
                $scope.ingredientInModal = $scope.ingredientInModal
                    .concat(
                        $scope.checklistIngs.splice(0, $scope.checklistIngs
                            .length
                        ));

                var query = $scope.query;
                if (query !== undefined && $scope.foodgroup.length >
                    0) {
                    searchService.search_ingredient(query, page,
                            $scope.foodgroup, sortby)
                        .then(function(response) {
                            $scope.details = response;
                            $scope.filts = response.filters; //model for storing response from API                
                            // pagination
                            $scope.currentPage = page;
                            $scope.pageSize = response.total *
                                6;
                        }, function(error) {
                            console.log(error);
                        });
                }
                else if (query != undefined && $scope.foodgroup.length ===
                    0) {
                    searchService.search_ingredient(query, page,
                            null, sortby)
                        .then(function(response) {
                            $scope.details = response;
                            $scope.filts = response.filters; //model for storing response from API                
                            // pagination
                            $scope.currentPage = page;
                            $scope.pageSize = response.total *
                                6;
                        }, function(error) {
                            console.log(error);
                        });
                }
                else {
                    searchService.search_ingredient(query, page,
                            null, sortby)
                        .then(function(response) {
                            $scope.details = response;
                            $scope.filts = response.filters; //model for storing response from API                
                            // pagination
                            $scope.currentPage = page;
                            $scope.pageSize = response.total *
                                6;
                        }, function(error) {
                            console.log(error);
                        });
                }

            }
        };

        $scope.searchPlan = function(query, page, sortby) {
            $scope.query = query;
            if (query) {
                $scope.search(page, sortby);
            }
        };

        $scope.addContents = function() {
            //add 
            for (var j = 0; j <
                $scope.checklistIngs.length; j++
            ) {
                $scope.ingredientInModal.push(
                    $scope.checklistIngs[j]);
            }
            $scope.checklistIngs = [];

            var currlength =
                $scope.plan_data[$scope.currentMealPlanName].followingMealPlanIngredient
                .length;

            //give a more sensible name to this variable
            var x = $scope.ingredientInModal.slice();

            //STRANGE LOOKING FOR LOOP
            for (var i = 0; i < x.length; i++) {

                // handle case where measure is only 100g or not an array
                if (x[i].measure.length !== 0) {
                    $scope.MealIngredients2Add
                        .push({
                            ingredient: x[i],
                            unit: x[i].measure[
                                0],
                            quantity: 1.00,
                        })
                }
                else {
                    MealIngredients2Add
                        .push({
                            ingredient: x[i],
                            unit: x[i].measure,
                            quantity: 1.00,

                        });
                }

                /* obj defined to add to scope meal plan array - id is added after getting
                 post response */
                var obj = {
                    'meal_ingredient': x[i],
                    'meal_history': $scope.plan_data[$scope.currentMealPlanName]
                        .id,
                    'quantity': parseFloat($scope.MealIngredients2Add[
                        i].quantity),
                    'unit_desc': $scope.MealIngredients2Add[i].unit,
                    'is_checked': false,
                };
                $scope.plan_data[$scope.currentMealPlanName]
                    .followingMealPlanIngredient.push(obj);
            }

            //post ingredients to db via url endpoint
            $scope.fillMealPlan(currlength, $scope.currentMealPlanName);

            $scope.ingredientInModal.length = 0;
            $('#add-food-modal')
                .closeModal();
        };

        // TBD
        $scope.fillMealPlan = function(ind, current) {
            var temp = $scope.MealIngredients2Add;
            $scope.MealIngredients2Add = [];
            for (var i = 0; i < temp.length; i++) {
                var saveind = i;

                // define object to push through the service to update DB
                var obj = {
                    'meal_ingredient': temp[i].ingredient.id,
                    'meal_history': $scope.plan_data[current].id,
                    'quantity': parseFloat(temp[
                        i].quantity),
                    'unit_desc': temp[i].unit.id,
                    'is_checked': false,
                };
                (function(cntr, obj) {
                    // here the value of i was passed into as the argument cntr
                    // and will be captured in this function closure so each
                    // iteration of the loop can have it's own value
                    summaryService.addEventIngredient(
                            obj)
                        .then(
                            function(response) {
                                // add id to scope meal plan array to enable deletion
                                $scope.plan_data[current]
                                    .followingMealPlanIngredient[
                                        ind + cntr]
                                    .id = response.id;

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



        $scope.calcMealPlanValues = function(index, nutrient) {
            var total = [];
            for (var i = 0; i < $scope.plan_data.length; i++) {
                var q = 0;
                
                /* Add nutrition information from ingredients */
                // TODO FIX WEIGHT ERROR
                for (var j = 0; j < $scope.plan_data[i].followingMealPlanIngredient
                    .length; j++) {
                    q += $scope.plan_data[i].followingMealPlanIngredient[
                        j].meal_ingredient[nutrient] * $scope.plan_data[
                        i].followingMealPlanIngredient[j].quantity;
                }
                
                /* Add nutrition information from recipes */
                for (var j = 0; j < $scope.plan_data[i].followingMealPlanRecipe
                    .length; j++) {
                    q += $scope.plan_data[i].followingMealPlanRecipe[
                        j].meal_recipe[nutrient] * $scope.plan_data[
                        i].followingMealPlanRecipe[j].no_of_servings;
                }
                total.push(q);
            }
            return total[index];

        };

        /* Calculates total value of a nutrient across a days plan */
        $scope.calcDayNutrientVal = function(nutrient) {
            var total = 0;
            for (var i = 0; i < $scope.plan_data
                .length; i++) {
                
                /* Add nutrition information from ingredients */
                for (var j = 0; j < $scope.plan_data[
                    i].followingMealPlanIngredient.length; j++) {
                    total += $scope.plan_data[i].followingMealPlanIngredient[
                        j].meal_ingredient[nutrient] * $scope.plan_data[
                        i].followingMealPlanIngredient[j].quantity;
                }
                
                /* Add nutrition information from recipes */
                for (var j = 0; j < $scope.plan_data[
                    i].followingMealPlanRecipe.length; j++) {
                    total += $scope.plan_data[i].followingMealPlanRecipe[
                        j].meal_recipe[nutrient] * $scope.plan_data[
                        i].followingMealPlanRecipe[j].no_of_servings;
                }

            }
            return total;
        };
        
        
        /* Calculates total value of a nutrient across a days plan that a user has checked*/
        $scope.calcCheckedNutrientVal = function(nutrient) {
            var total = 0;
            for (var i = 0; i < $scope.plan_data
                .length; i++) {
                
                /* Add nutrition information from ingredients */
                for (var j = 0; j < $scope.plan_data[
                    i].followingMealPlanIngredient.length; j++) {
                    if($scope.plan_data[i].followingMealPlanIngredient[j]
                       .is_checked){
                        total += $scope.plan_data[i].followingMealPlanIngredient[
                            j].meal_ingredient[nutrient] * $scope.plan_data[
                            i].followingMealPlanIngredient[j].quantity;
                    }
                }
                
                /* Add nutrition information from recipes */
                for (var j = 0; j < $scope.plan_data[
                    i].followingMealPlanRecipe.length; j++) {
                    if($scope.plan_data[i].followingMealPlanRecipe[j]
                       .is_checked){
                        total += $scope.plan_data[i].followingMealPlanRecipe[
                            j].meal_recipe[nutrient] * $scope.plan_data[
                            i].followingMealPlanRecipe[j].no_of_servings;
                    }
                }

            }
            return total;
        };


        /* calculate %age checked nutrient value */
        $scope.percentNutrientChecked = function(nutrient){
            var a = $scope.calcCheckedNutrientVal(nutrient);
            var b = $scope.calcDayNutrientVal(nutrient);
            var result = 100* (a/b);
            return result + '%';
        }


    }
]);