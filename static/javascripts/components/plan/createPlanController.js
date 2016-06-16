/* controller for createplan pages */

/* global app, moment, $, console */

app.controller('createPlanController', ['$scope', '$window', 'AuthService',
    '$routeParams', 'searchService', '$location', 'planService', 'summaryService',
    function($scope, $window, AuthService, $routeParams, searchService,
        $location, planService, summaryService)
    {
        //temp fixe - it has bugs - profile pic wont dropdown
        $('#navbar').show();
        
        'use strict';
        /* CHECK AUTH STATUS - ONLY AUTHENTICATED USERS SHOULD
        BE ABLE TO CREATE A PLAN */
        AuthService.isAuthenticated().then(function(response)
        {
            var params = $routeParams;
            
            var urlParamWeek = params.week? parseInt(params.week) : 1;
            var urlParamDay = params.day? parseInt(params.day) : 1;
            
            var isAuth = response.status;
            var currentUser = response.pk;
            /*page is visible only if user is authenticated
                    TODO : page is visible only to creator of plan */
            if (isAuth)
            {
                /*if authed then create these objects*/
                /* week & day count for current plan */
                $scope.weekCount = [];
                $scope.dayCount = [];
                $scope.checklistIngs = [];
                $scope.ingredientInModal = [];
                $scope.checklistReps = [];
                $scope.recipeInModal = [];
                $scope.foodgroup = [];
                //$scope.searchType = 'ingredients';
                $scope.searchTypeChoices =  ["Ingredients", "Recipes"];
                $scope.searchType = 'Ingredients';
                $scope.searchHistoryTypeChoices = ["My Ingredients", "My Recipes"];
                $scope.searchHistoryType = "My Ingredients";
                /* phase of the day */
                $scope.amPmArray = ['AM', 'PM'];
                
                /* urls for previous and next buttons */
                $scope.backUrl3 = '/dietplans/create/complete/' + $routeParams.id;
                $scope.backUrl2 = '/dietplans/create/overview/' + $routeParams.id;
                $scope.nextUrl2 = '/dietplans/view-diet-plan/' + $routeParams.id;
                
                $scope.dayWeekNos = 0;
                $scope.currentDayWeekNos = 7*(urlParamWeek - 1) + urlParamDay;
                /* stores the details to get current day plan
                        this is used to make the first query
                        parameters are extracted from routeParams*/
                $scope.dayplan = {
                    'day_no':  urlParamDay,
                    'week_no': urlParamWeek
                };
                
                /* unit for height */
                $scope.unit = 0;
                
                /* Function that updates the main descriptors of a diet plan
                        from the first create plan page */
                $scope.initialize_plan = function()
                {
                    var id = $routeParams.id;
                    planService.updatePlan($scope.plan, id)
                        .then(function(response)
                        {
                            $location.path('/dietplans/create/complete/' +
                                response.id);
                        }, function(error)
                        {
                            console.log(error);
                        });
                };
                /* get the diet plan in question from the server */
                planService.getDietPlan($routeParams.id).then(
                    function(response)
                    {
                        $scope.plan = response;

                        if($scope.plan.creator !== currentUser){
                            $location.path('/dietplans/view-diet-plan/' + $routeParams.id + '/');
                        }
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
                        $scope.dayWeekNos = $scope.plan.duration*7;
                        
                        for (var i = 1; i <= $scope.plan.duration; i++)
                        {
                            $scope.weekCount.push(
                            {
                                'id': i,
                                'name': 'Week' +
                                    ' ' + i
                            });
                        }
                        for (var j = 1; j <= 7; j++)
                        {
                            $scope.dayCount.push(
                            {
                                'id': j,
                                'name': 'Day' + ' ' +
                                    j
                            });
                        }
                    }, function(error)
                    {
                        console.log(error);
                    });
                /*opens jump to or copy to modal*/
                $scope.openJumpToModal = function(type)
                {
                    $scope.jumpToModalType = type;
                    $('#jump-to-modal').openModal();
                };
                //function to copy the current day plan and jump to feature
                //type determines what is the task
                //if type is copy then it will copy
                //if type is jump then it will jump
                $scope.daySelect = function(type, week, day)
                {
                    if (type === 'copy')
                    {
                        if (day != $scope.dayplan.day_no ||
                            week != $scope.dayplan.week_no)
                        {
                            planService.copyDayPlan(
                            {
                                'from_day': $scope.dayplan
                                    .day_no,
                                'from_week': $scope
                                    .dayplan.week_no,
                                'to_day': day,
                                'to_week': week,
                                'dietplan': $scope.plan
                                    .id
                            }).then(function(response)
                            {
                                $('#jump-to-modal')
                                    .closeModal();
                            }, function(error)
                            {
                                console.log(error);
                            });
                        }
                    }
                    else if (type === 'jump')
                    {
                        $scope.dayplan.day_no = parseInt(
                            day);
                        $scope.dayplan.week_no = parseInt(
                            week);
                        $scope.getDayPlan($scope.dayplan.day_no,
                            $scope.dayplan.week_no);
                        
                        $('#jump-to-modal').closeModal();
                    }
                };
                
                /* Function to update day_no or week_no */
                $scope.updateDayPlan = function(param, val,
                    index)
                {
                    // made shorter with ternary operator and modulo division
                    var multiplier = param === "week_no" ? 7 : param === "day_no" ? 1 : 0;
                                        
                    $scope.currentDayWeekNos += (multiplier*val);
                    
                    if($scope.currentDayWeekNos > $scope.dayWeekNos){
                        $scope.currentDayWeekNos = $scope.currentDayWeekNos % $scope.dayWeekNos;
                    }else if ($scope.currentDayWeekNos <= 0){
                        $scope.currentDayWeekNos = $scope.currentDayWeekNos + $scope.dayWeekNos;
                    }
                    
                    $scope.dayplan.day_no = ($scope.currentDayWeekNos % 7);
                    if($scope.dayplan.day_no === 0){
                        $scope.dayplan.day_no = 7;
                    }
                    $scope.dayplan.week_no = Math.ceil($scope.currentDayWeekNos/7);
                    
                    $scope.getDayPlan($scope.dayplan.day_no,
                            $scope.dayplan.week_no);
                    
                };
                // TODO: update for API
                $scope.getDayPlan = function(day, week)
                {
                    var id = $routeParams.id;
                    
                    $location.search('week', week);
                    $location.search('day', day);
                    planService.getdayplan(id, day, week).then(
                        function(response)
                        {
                            $scope.dayplan.id =
                                response.id;
                            $scope.dayplan.day_no =
                                response.day_no;
                            $scope.dayplan.week_no =
                                response.week_no;
                            for (var i = 0; i <
                                response.mealplan.length; i++
                            )
                            {
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
                                )
                                {
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
                                //parse recipe servings to float
                                for (j = 0; j <
                                    response.mealplan[i]
                                    .mealrecipe.length; j++
                                )
                                {
                                    response.mealplan[i]
                                        .mealrecipe[j].servings =
                                        parseFloat(
                                            response.mealplan[
                                                i].mealrecipe[
                                                j].servings
                                        );
                                }
                            }
                            $scope.mealPlanNameArray =
                                response.mealplan;
                            for (var m = 0; m < $scope.mealPlanNameArray
                                .length; m++)
                            {
                                $scope.mealPlanNameArray[
                                    m].mealNutrition = {};
                            }
                            
                        }, function(error)
                        {
                            console.log(error);
                        });
                };
                //get initial data for day1 and week 1 of the plan
                $scope.getDayPlan($scope.dayplan.day_no, $scope
                    .dayplan.week_no);
                
                var weightedIngredientAdditionalNutritionSum = function(cntr_i, cntr_j){
                    $scope.mealPlanNameArray[cntr_i]
                            .mealingredient[cntr_j]
                            .additionalIngInfo = {};
                    
                    searchService.get_ingredient_addtnl_info(
                        $scope.mealPlanNameArray[cntr_i]
                            .mealingredient[cntr_j].ingredient.id)
                            .then(function (response){

                            //model for storing response from API 
                            $scope
                                .mealPlanNameArray[cntr_i]
                                .mealingredient[cntr_j]
                                .additionalIngInfo = response;
                        },
                        function(error) {
                            console.log(error);
                        });
                    };
                
                var weightedRecipeAdditionalNutritionSum = function(cntr_i,cntr_j){
                    $scope.mealPlanNameArray[cntr_i]
                        .mealrecipe[cntr_j].additionalRecInfo = {};
                    searchService.get_recipe_addtnl_info(
                         $scope.mealPlanNameArray[cntr_i].mealrecipe[cntr_j]
                        .recipe.id).then(function(response) {
                            //model for storing response from API 
                            $scope.mealPlanNameArray[cntr_i].mealrecipe[cntr_j]
                                .additionalRecInfo = response;
                        },
                        function(error) {
                            console.log(error);
                        });
                };
                
                // function to populate additional ingredients info inside mealplan array
                $scope.getAdditionalIngredientsInfo = function()
                {
                    if ($scope.mealPlanNameArray !==
                        undefined)
                    {
                        for (var i = 0; i < $scope.mealPlanNameArray
                            .length; i++)
                        {
                            if ($scope.mealPlanNameArray[i]
                                .mealingredient !==
                                undefined)
                            {
                                for (var j = 0; j < $scope.mealPlanNameArray[
                                    i].mealingredient.length; j++)
                                {
                                    //callback function to deal with the 
                                    //asynchronous call within for loop
                                    //potentially save additional requests here
                                    weightedIngredientAdditionalNutritionSum(i, j);
                                }
                            }
                            
                            // same for recipes
                            if ($scope.mealPlanNameArray[i]
                                .mealrecipe !==
                                undefined)
                            {
                                for (var j = 0; j < $scope.mealPlanNameArray[
                                    i].mealrecipe.length; j++)
                                {
                                    //callback function to deal with the 
                                    //asynchronous call within for loop
                                    //potentially save additional requests here

                                    weightedRecipeAdditionalNutritionSum(i, j);
                                }
                            }
                        }
                    }
                };
                
                $scope.$watchCollection('mealPlanNameArray',
                function()
                {
                    $scope.getAdditionalIngredientsInfo();
                });
                // creates an array of hours to choose from
                $scope.addMealHours = [];
                for (var i = 0; i <= 23; i++)
                {
                    $scope.addMealHours.push(i);
                }
                // creates an array of minutes to choose from
                $scope.addMealMinutes = [];
                for (var j = 0; j <= 59; j++)
                {
                    $scope.addMealMinutes.push(j);
                }
                // updates name and time of a meal plan
                $scope.updateDayMealPlan = function(index)
                {
                    if ($scope.mealPlanNameArray[index] !==
                        undefined)
                    {
                        var obj = {
                            'name': $scope.mealPlanNameArray[
                                index].mealname,
                            'time': $scope.mealPlanNameArray[
                                    index].time.getHours() +
                                ':' + $scope.mealPlanNameArray[
                                    index].time.getMinutes()
                        };
                        planService.updateMealPlan(obj,
                            $scope.mealPlanNameArray[
                                index].id).then(
                            function(response)
                            {
                            }, function(error)
                            {
                                console.log(error);
                            });
                    }
                };
                                
                // updates meal ingredient in a meal plan
                $scope.updateMealIngredient = function(obj)
                {
                    // CONSIDER RENAMING THIS
                    var obje = {
                        'quantity': parseFloat(obj.quantity),
                        'ingredient': obj.ingredient.id,
                        'unit': obj.unit.id
                    };
                    planService.updateMealIngredient(obje,
                        obj.id).then(function()
                    {
                        // TODO: update msg to user
                    }, function(error)
                    {
                        console.log(error);
                    });
                };
                // updates meal recipe in a meal plan
                $scope.updateMealRecipe = function(obj)
                {
                    // CONSIDER RENAMING THIS
                    var obje = {
                        'servings': parseFloat(obj.servings),
                        'ingredient': obj.recipe.id,
                    };
                    planService.updateMealRecipe(obje, obj.id)
                        .then(function()
                        {
                            // TODO: update msg to user
                        }, function(error)
                        {
                            console.log(error);
                        });
                };
                //watch the filter and request new results as soon as 
                //filters are changed
                $scope.$watchCollection('foodgroup', function()
                {
                    $scope.search(1, $scope.sortby);
                });
                //searches recipes or ingredients
                //only works for ingredients right now
                $scope.searchPlan = function(query, page,
                    sortby)
                {
                    $scope.query = query;
                    if (query !== undefined && $scope.searchType ===
                        'Ingredients')
                    {
                        $scope.search(page, sortby);
                    }
                    else if (query !== undefined && $scope.searchType ===
                        'Recipes')
                    {
                        $scope.search_recipe(page, sortby);
                    }
                };
                /*main search fn, executed on page change(page specifies page
                          number to be displayed)checks whether applied sort 
                          order is same as previous sort order or not, 
                          if not, then only make the request, if the order is same and 
                          filters are same, then do not make the request.
                        */
                //for recipes
                $scope.search_recipe = function(page, sortby)
                {
                    var query = $scope.query;
                    $scope.details = undefined;
                    if (query !== undefined)
                    {
                        $scope.sortby = sortby;
                        // Below 3 lines cause duplicate addition in modal
                        // TODO : delete when stable
//                        $scope.ingredientInModal = $scope.ingredientInModal
//                            .concat($scope.checklistIngs.splice(
//                                0, $scope.checklistIngs
//                                .length));
                        searchService.search_recipe(query,
                            page, sortby).then(function(
                            response)
                        {
                            $scope.details =
                                response;
                            $scope.currentPage =
                                page;
                            $scope.pageSize =
                                response.total * 6;
                        }, function(error)
                        {
                            console.log(error);
                        });
                    }
                };
                //for ingredients
                $scope.search = function(page, sortby)
                {
                    $scope.details = undefined;
                    if ($scope.query !== undefined)
                    {
                        $scope.sortby = sortby;
                        //Below 3 lines cause duplicate addition in modal upon changing 
                        // TODO : delete when stable
                        // paginated pages
//                        $scope.ingredientInModal = $scope.ingredientInModal
//                            .concat($scope.checklistIngs.splice(
//                                0, $scope.checklistIngs
//                                .length));
                        
                        
                        var query = $scope.query;
                        if (query !== undefined && $scope.foodgroup
                            .length > 0)
                        {
                            searchService.search_ingredient(
                                query, page, $scope.foodgroup,
                                sortby).then(function(
                                response)
                            {
                                $scope.details =
                                    response;
                                $scope.filts =
                                    response.filters; //model for storing response from API                
                                // pagination
                                $scope.currentPage =
                                    page;
                                $scope.pageSize =
                                    response.total *
                                    6;
                            }, function(error)
                            {
                                console.log(error);
                            });
                        }
                        else if (query !== undefined &&
                            $scope.foodgroup.length === 0)
                        {
                            searchService.search_ingredient(
                                query, page, null,
                                sortby).then(function(
                                response)
                            {
                                $scope.details =
                                    response;
                                $scope.filts =
                                    response.filters; //model for storing response from API                
                                // pagination
                                $scope.currentPage =
                                    page;
                                $scope.pageSize =
                                    response.total *
                                    6;
                            }, function(error)
                            {
                                console.log(error);
                            });
                        }
                        else
                        {
                            searchService.search_ingredient(
                                query, page, null,
                                sortby).then(function(
                                response)
                            {
                                $scope.details =
                                    response;
                                $scope.filts =
                                    response.filters; //model for storing response from API                
                                // pagination
                                $scope.currentPage =
                                    page;
                                $scope.pageSize =
                                    response.total *
                                    6;
                            }, function(error)
                            {
                                console.log(error);
                            });
                        }
                    }
                };
                
                $scope.getMySavedFoods = function(page){
                    if(!page){
                        page = 1;
                    }
                    if($scope.searchHistoryType === "My Ingredients"){
                        summaryService.getShortlistIngredients(page).then(function(response){

                            $scope.mySavedStuff = response;
                            // pagination
                            $scope.mySavedStuffCurrentPage = page;
                            $scope.mySavedStuffPageSize = response.total * 6;

                        }, function(error){
                            console.log(error);
                        });
                    } else if($scope.searchHistoryType === "My Recipes"){
                        summaryService.searchShortlistedRecipes('', 
                                            page).then(function(response){
                            $scope.mySavedStuff = response;

                            // pagination
                            $scope.mySavedStuffCurrentPage = page;
                            $scope.mySavedStuffPageSize = response.total * 6;

                        }, function(error){
                            console.log(error);
                        });
                    }
                };

                //$scope.getMySavedFoods();

                $scope.$watch('searchHistoryType', function(newVal, oldVal){
                    $scope.getMySavedFoods();
                })
        
                //opens modal to add ingredients/recipes on a current mealplan
                $scope.openCreatePlanModal = function(index)
                {
                    $('#add-food-modal').openModal();
                    $scope.currentMealPlanName = index;
                };
                
                //opens modal to add ingredients/recipes from history
                $scope.openQuickToolsModal = function(index) {
                    $scope.currentMealPlanName = index;
                    //$scope.getMyIngredients();
                    $('#quick-tools-modal')
                        .openModal();
                };
        
                // array to store the nutrient values in modal for 
                // every ingredient checked
                // copies the ingredients selected in the respective meal array
                $scope.addContents = function()
                {
                    // currentmealPlanname, nutrientvalue
                    // these should be used to create a post request  to create meal
                    for (var j = 0; j < $scope.checklistIngs
                        .length; j++)
                    {
                        $scope.ingredientInModal.push(
                            $scope.checklistIngs[j]);
                    }
                    
                    $scope.checklistIngs = [];
                    
                    var currlength = $scope.mealPlanNameArray[
                            $scope.currentMealPlanName].mealingredient
                        .length;
                    var currrecipelength = $scope.mealPlanNameArray[
                            $scope.currentMealPlanName].mealrecipe
                        .length;
                    //give a more sensible name to this variable
                    var x = $scope.ingredientInModal.slice();
                    for (var i = 0; i < x.length; i++)
                    {
                        if (x[i].created_by !== undefined)
                        {
                            $scope.mealPlanNameArray[$scope
                                    .currentMealPlanName].mealrecipe
                                .push(
                                {
                                    recipe: x[i],
                                    servings: x[i].servings,
                                });
                        }
                        // handle case where measure is only 100g or not an array
                        else if (x[i].measure.length !== 0)
                        {
                            $scope.mealPlanNameArray[$scope
                                    .currentMealPlanName].mealingredient
                                .push(
                                {
                                    ingredient: x[i],
                                    unit: x[i].measure[
                                        0],
                                    quantity: parseFloat(x[i].measure[0].amount),
                                });
                        }
                        else
                        {
                            console.log("YOU SHOULD NOT SEE THIS. MEASURE ALWAYS ARRAY");
                            $scope.mealPlanNameArray[$scope
                                    .currentMealPlanName].mealingredient
                                .push(
                                {
                                    ingredient: x[i],
                                    unit: x[i].measure,
                                    quantity: 1.00,
                                });
                        }
                        
                    }
                    $scope.getAdditionalIngredientsInfo();
                    //post ingredients to db via url endpoint
                    $scope.fillMealPlan(currlength,
                        currrecipelength, $scope.currentMealPlanName
                    );
                    $scope.ingredientInModal.length = 0;
                    $('#add-food-modal').closeModal();
                    $('#quick-tools-modal').closeModal();
                    
                    $scope.details = undefined;
                    $scope.filts = undefined;
                    $scope.query = undefined;
                    $scope.pageSize = null;
                    $scope.currentPage = null;

                    $scope.mySavedStuffQuery = '';
                };
                
                // uncheck all the selected items if save button is not clicked
                $scope.emptyModalContents = function()
                {
                    $('#add-food-modal').closeModal();
                };
                //function to disable search result checkboxes which have 
                //already been selected
                $scope.checkToDisable = function(index)
                {
                    for (var k = 0; k < $scope.mealPlanNameArray[
                            $scope.currentMealPlanName].mealingredient
                        .length; k++)
                    {
                        if ($scope.mealPlanNameArray[$scope
                            .currentMealPlanName].mealingredient[
                            k].ingredient.id === index)
                        {
                            return true;
                        }
                    }
                    for (var i = 0; i < $scope.mealPlanNameArray[
                            $scope.currentMealPlanName].mealrecipe
                        .length; i++)
                    {
                        if ($scope.mealPlanNameArray[$scope
                            .currentMealPlanName].mealrecipe[
                            i].recipe.id === index)
                        {
                            return true;
                        }
                    }
                    return false;
                };
                // DEFAULT serving per ingredient
                $scope.amount = 1;
                // to fire red(-) button which removes the entire meal
                $scope.clearMeal = function(element)
                {
                    var temp = $scope.mealPlanNameArray[
                        element];
                    planService.deleteMealPlan(temp.id).then(
                        function(response)
                        {
                            $scope.mealPlanNameArray.splice(
                                element, 1);
                        }, function(error)
                        {
                            console.log(error);
                        });
                };
                // adds new mealname
                $scope.addMeal = function(key)
                {
                    var tm = key.time;
                    var mealObjToUpdate = {
                        day: $scope.dayplan.id,
                        name: key.name,
                        time: moment(tm).format(
                            'HH:mm:ss')
                    };
                    //convert to JS date format for rendering
                    /* update the database */
                    planService.createMealPlan(
                        mealObjToUpdate).then(function(
                        response)
                    {
                        /* update the view variables for meals */
                        $scope.mealPlanNameArray.push(
                        {
                            'mealname': key
                                .name,
                            'mealingredient': [],
                            'time': tm,
                            'mealrecipe': [],
                            'id': response.mealplanid,
                            'counter': $scope
                                .mealPlanNameArray
                                .length,
                            'day': $scope.dayplanid,
                            'mealNutrition':
                            {}
                        });
                    }, function(error)
                    {
                        console.log(error);
                    });
                    $('#add-meal-modal').closeModal();
                };
                $scope.triggerAddMealModal = function()
                {
                    $('#add-meal-modal').openModal();
                };
                $scope.nextDayPlan = function(element)
                {
                    $scope.mealPlanNameArray[element] = [];
                };
                
                // removes ingredients from the modal
                $scope.removeIngredient = function(element)
                {
                    var index = $scope.ingredientInModal.indexOf(
                        element);
                    $scope.ingredientInModal.splice(index,
                        1);
                };
                
                // removes ingredients which are saved in meal
                $scope.removeIngredientsFromSavedMeal =
                    function(key, element)
                    {
                        var temp = $scope.mealPlanNameArray[key]
                            .mealingredient[element];
                        planService.deleteMealIngredient(temp.id)
                            .then(function(response)
                            {
                                $scope.mealPlanNameArray[
                                        key].mealingredient
                                    .splice(element, 1);
                            }, function(response) {});
                    };
                
                // removes recipes which are saved in meal
                $scope.removeFromSavedMealRecipe =
                    function(key, element)
                    {
                        var temp = $scope.mealPlanNameArray[key]
                            .mealrecipe[element];
                        planService.deleteMealRecipe(temp.id).then(
                            function(response)
                            {
                                $scope.mealPlanNameArray[
                                    key].mealrecipe.splice(
                                    element, 1);
                            }, function(response) {});
                    };
                
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
                    return result;
                };
                
                // meal wise nutrition info
                $scope.calcMealNutrientVal = function(index, nutrient, isAdditional){
                    var total = [];
                    if ($scope.mealPlanNameArray && index!==undefined)
                    {
                        for (var i = 0; i < $scope.mealPlanNameArray
                            .length; i++)
                        {
                            var q = 0;
                            /* add nutrition information of ingredients */
                            for (var j = 0; j < $scope.mealPlanNameArray[
                                i].mealingredient.length; j++)
                            {
                                if (isAdditional)
                                {
                                    if(checkIngredNutritionQty($scope.mealPlanNameArray[
                                i].mealingredient[j], nutrient, isAdditional)){
                                        q += parseFloat(
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
                                }
                                else
                                {
                                    if(checkIngredNutritionQty($scope.mealPlanNameArray[
                                i].mealingredient[j], nutrient, false)){
                                        q += parseFloat($scope.mealPlanNameArray[
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
                            /* add nutrition information of recipes */
                            for (var j = 0; j < $scope.mealPlanNameArray[
                                i].mealrecipe.length; j++)
                            {
                                if (isAdditional){
                                    if(checkRecipeNutritionQty($scope.mealPlanNameArray[
                                i].mealrecipe[j], nutrient, isAdditional)){
                                        q += parseFloat(
                                                $scope.mealPlanNameArray[
                                                    i].mealrecipe[
                                                    j].additionalRecInfo[
                                                    nutrient
                                                ]) *
                                            parseFloat(
                                                $scope.mealPlanNameArray[
                                                    i].mealrecipe[
                                                    j].servings
                                            );
                                    }
                                }
                                else{
                                    if(checkRecipeNutritionQty($scope.mealPlanNameArray[
                                i].mealrecipe[j], nutrient, false)){
                                        q += parseFloat($scope.mealPlanNameArray[
                                                i].mealrecipe[
                                                j].recipe[
                                                nutrient]) *
                                            parseFloat($scope.mealPlanNameArray[
                                                i].mealrecipe[
                                                j].servings);
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
                
                //function to create meal ingredients related to given mealplan
                $scope.fillMealPlan = function(ind, recipeind,
                    current)
                {
                    var temp = $scope.mealPlanNameArray[
                        current].mealingredient;
                    var temprecipearr = $scope.mealPlanNameArray[
                        current].mealrecipe;
                    for (var i = ind; i < temp.length; i++)
                    {
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
                        (function(cntr, obj)
                        {
                            // here the value of i was passed into as the
                            // argument cntr
                            // and will be captured in this function closure so each
                            // iteration of the loop can have it's own value
                            planService.createMealIngredient(
                                obj).then(function(
                                response)
                            {
                                $scope.mealPlanNameArray[
                                        current
                                    ].mealingredient[
                                        cntr].id =
                                    response.meal_ingredient_id;
                            }, function(error)
                            {
                                console.log(
                                    error);
                            });
                        })(i, obj);
                    }
                    for (var i = recipeind; i <
                        temprecipearr.length; i++)
                    {
                        // CONSIDER RENAMING THIS HORRIBLY NAMED OBJECT
                        var obj = {
                            'recipe': temprecipearr[i].recipe
                                .id,
                            'meal_plan': $scope.mealPlanNameArray[
                                current].id,
                            'servings': parseFloat(
                                temprecipearr[i].servings
                            )
                        };
                        (function(cntr, obj)
                        {
                            // here the value of i was passed into as the 
                            // argument cntr
                            // and will be captured in this function closure so each
                            // iteration of the loop can have it's own value
                            planService.createMealRecipe(
                                obj).then(function(
                                response)
                            {
                                $scope.mealPlanNameArray[
                                        current
                                    ].mealrecipe[
                                        cntr].id =
                                    response.meal_recipe_id;
                            }, function(error)
                            {
                                console.log(
                                    error);
                            });
                        })(i, obj);
                    }
                };
                
                $scope.updateQuantity = function(meal_index, ingredient_index){
                $scope.plan_data[meal_index].followingMealPlanIngredient[ingredient_index]
                    .quantity = 
                    parseFloat($scope.plan_data[meal_index]
                           .followingMealPlanIngredient[ingredient_index]
                           .unit_desc.amount);
            };
                
                $scope.openMealInfoModal = function(index)
                {
                    $('#meal-info-modal').openModal();
                    $scope.selected = index;
                };
                
                
                $scope.searchMySavedStuff = function(page){
                    if($scope.searchHistoryType==="My Ingredients"){
                        summaryService.searchShortlistedStuff($scope.mySavedStuffQuery, page, "ingredients")
                            .then(function(response){

                            $scope.mySavedStuff = response;
                            //$scope.filts = response.filters; //model for storing response from API                
                            // pagination
                            $scope.mySavedStuffCurrentPage = page;
                            $scope.mySavedStuffPageSize = response.total *
                                6;
                        }, function(error){

                        });
                    } else if($scope.searchHistoryType==="My Recipes"){
                        summaryService.searchShortlistedRecipes($scope.mySavedStuffQuery, page)
                            .then(function(response){
                            $scope.mySavedStuff = response;
                            //$scope.filts = response.filters; //model for storing response from API                
                            // pagination
                            $scope.mySavedStuffCurrentPage = page;
                            $scope.mySavedStuffPageSize = response.total *
                                6;
                        }, function(error){

                        });
                    }
                };
        
                $scope.getSavedStuffNextPage = function(page){
                    if($scope.mySavedStuffQuery.length>0){
                        $scope.searchMySavedStuff(page);
                    }else{
                        $scope.getMySavedFoods(page);
                    }
                };
                
                $scope.clearFoodGroup = function(){
                    $scope.foodgroup = [];
                };
        
            }
            else
            {
                $location.path('/');
            }
        }, function(error)
        {
            console.log(error);
            $location.path('/');
        });
    }
]);