'use strict';

app.controller('createRecipeController', ['$scope', 'AuthService',
    '$routeParams', 'constants',
    'searchService', '$location', 'recipeService',
    function($scope, AuthService, $routeParams, constants,
        searchService,
        $location,
        recipeService) {

        AuthService.isAuthenticated()
            .then(function(response) {
                var isAuthenticated = response.status;
                if (isAuthenticated) {

                    /* initialize scope variables to interact with DOM */

                    // stores the entries from the checkbox prior to saving into
                    // recipe ingredients

                    //This is to store the checked results from the given search page
                    $scope.checklistIngs = [];

                    //this is to store all the checked/selected results
                    $scope.checklistIngredients = [];

                    // stores the ingredients added to the recipe so far
                    $scope.ingredientDisplay = [];

                    //stores the last ingredient added to the recipe
                    $scope.lastChecked = null;
                    $scope.AdditionalIngredientInfo = [];

                    //variables to gather additional information
                    $scope.prepHours = 0;
                    $scope.prepMins = 0;
                    $scope.cookHours = 0;
                    $scope.cookMins = 0;
                    $scope.recipe = {};

                    // route to navigate to view the recipe after creation
                    $scope.view_recipe = '/viewRecipe/' +
                        $routeParams.id;

                    /* variables & functions to upload image file for recipe */
                    $scope.formdata = new FormData();
                    $scope.getTheFiles = function($files) {
                        angular.forEach($files, function(value,
                            key) {
                            $scope.formdata.append(
                                'file', value);
                        });

                    };

                    $scope.uploadFile = function(id) {
                        var file = $scope.recipe_image_file;
                        var url = '/recipes/recipe/' + id +
                            '/';
                        if (file) {
                            recipeService.uploadRecipeImage(
                                file, url);
                        }
                    };
                    
                       $scope.initialize_recipe = function()
                {
                    var id = $routeParams.id;
                    recipeService.updateRecipe($scope.recipe, id)
                        .then(function(response)
                        {
                            console.log(response);
                        }, function(error)
                        {
                            console.log(error);
                        });
                };


                    /* Nutritional Information calculations based on changes to
                        selected ingredients */

                    $scope.calculateNutritionTotal = function(
                            nutrient) {
                            var total = 0;
                            var servings = parseInt($scope.recipe.servings);
                            //prevent divide by zero
                            if (!servings) {
                                servings = 1;
                            }
                            for (var i = 0; i < $scope.ingredientDisplay
                                .length; i++) {
                                total += parseFloat($scope.ingredientDisplay[
                                        i].ingredient[nutrient]) *
                                    parseFloat($scope.ingredientDisplay[
                                        i].quantity) * parseFloat(
                                        $scope.ingredientDisplay[i]
                                        .selected_measure.weight) /
                                    (100 * servings);
                            }
                            return total;
                        }
                        /* calculates additional nutritional information */
                    $scope.calculateAddtnlNutritionTotal = function(
                        nutrient) {
                        var total = 0;
                        var servings = parseInt($scope.recipe.servings);
                        //prevent divide by 0
                        if (!servings) {
                            servings = 1;
                        }
                        for (var i = 0; i < $scope.AdditionalIngredientInfo
                            .length; i++) {
                            total += parseFloat($scope.AdditionalIngredientInfo[
                                    i][nutrient]) * parseFloat(
                                    $scope.ingredientDisplay[i]
                                    .quantity) * parseFloat(
                                    $scope.ingredientDisplay[i]
                                    .selected_measure.weight) /
                                (100 * servings)
                        }
                        return total;
                    }



                    /* search function for the ingredient modal */
                    $scope.foodgroup = [];


                    //Checks for applied filters, as soon as a new filter is applied or removed
                    //search result is changed.

                    $scope.$watchCollection('foodgroup', function(
                        newVal, oldVal) {

                        $scope.search(1, $scope.sortby);


                    });

                    //main search fn, executed on page change(page specifies page number to be displayed)
                    //checks whether applied sort order is same as previous sort order or not, 
                    //if not, then only make the request, if the order is same and filters are same,
                    //then do not make the request.
                    $scope.search = function(page, sortby) {
                        $scope.details = undefined;
                        if($scope.query!==undefined){

                        $scope.sortby = sortby;
                        $scope.checklistIngredients = $scope.checklistIngredients.concat(
                                                        $scope.checklistIngs.splice(0,$scope.checklistIngs.length
                                                        ));
                        
                        var query = $scope.query;
                        console.log(query, page, sortby);
                        if (query !==undefined && $scope.foodgroup.length >0) {
                            searchService.search_ingredient(query, page, $scope.foodgroup, sortby)
                                .then(function(response) {
                                    $scope.details = response;
                                    $scope.filts = response.filters;
                                //model for storing response from API                
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
                                    $scope.filts = response.filters; 
                                    //model for storing response from API                
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
                                    $scope.filts = response.filters; 
                                    //model for storing response from API                
                                    // pagination
                                    $scope.currentPage = page;
                                    $scope.pageSize = response.total*6;
                                }, function(error) {
                                    console.log(error);
                                });
                        }

                        }
                    };

                    /* function that opens the modal */
                    // is create recipe a modal anymore??
                    $scope.addRecipeIngredModal = function() {
                        $scope.lastChecked = null;
                        $('#add-ingredients-modal')
                            .openModal();
                    };

                    /* watch the value of nutrient value to detect change 
                      and update the last checked value */
                    $scope.$watchCollection('checklistIngs',
                        function(
                            newVal, oldVal) {
                            if (newVal.length > 0) {
                                $scope.lastChecked = newVal[
                                    newVal.length - 1];
                            }
                        }, true);

                    /* function to remove an ingredient from the recipe 
                    checklist and templist */
                    $scope.removeIngredient = function(element) {
                        // remove ingredient from checklist temp array
                        var index1 = $scope.checklistIngs
                            .indexOf(element);

                        if (index1 >= 0) {
                            $scope.checklistIngs.splice(
                                index1, 1);
                        }

                        var index2 = $scope.checklistIngredients
                            .indexOf(element);
                        if (index2 >= 0) {
                            $scope.checklistIngredients.splice(
                                index2, 1);
                        }

                        // remove ingredient from recipe ingredients
                        var index3 = -1;
                        for (var ind = 0; ind < $scope.ingredientDisplay
                            .length; ind++) {
                            if (element.id === $scope.ingredientDisplay[
                                ind].ingredient.id) {
                                index3 = ind;
                                break;
                            }
                        }
                        if (index3 >= 0) {
                            $scope.ingredientDisplay.splice(
                                index3,
                                1);
                        }
                    };

                    
                    /* function to remove an ingredient from the recipe */
                    $scope.removeIngs = function(index) {
                        // remove ingredient from checklist array
                        var index2 = -1;
                        for (var i = 0; i < $scope.checklistIngredients
                            .length; i++) {
                            if ($scope.checklistIngredients[i].id ===
                                $scope.ingredientDisplay[index]
                                .ingredient.id) {
                                index2 = i;
                            }
                        }
                        if (index2 >= 0) {
                            $scope.checklistIngredients.splice(
                                index2, 1);
                        }

                        // remove ingredient from recipe ingredients

                        $scope.ingredientDisplay.splice(index,
                            1);

                        // remove ingredient from recipe ingredients
                        $scope.AdditionalIngredientInfo.splice(
                            index,
                            1);
                    };


                    /* add contents from the modal to the recipe */
                    $scope.addContents = function() {
                        /*loop over the checklist mode (nutrient value) and
                          add to the ingredients 
                          also, add the weight of each ingredient measure to 
                          use in calculating total nutrient

                        add to the ingredients */
                        for (var j = 0; j <
                            $scope.checklistIngs.length; j++
                        ) {
                            $scope.checklistIngredients.push(
                                $scope.checklistIngs[j]);
                        }
                        $scope.checklistIngs = [];


                        for (var i = $scope.ingredientDisplay.length; i <
                            $scope.checklistIngredients.length; i++
                        ) {
                            // call API to get addtional ingredient information

                            searchService.get_ingredient_addtnl_info(
                                    $scope
                                    .checklistIngredients[i]
                                    .id)
                                .then(function(response) {
                                    //model for storing response from API                
                                    $scope.AdditionalIngredientInfo
                                        .push(response);
                                }, function(error) {
                                    console.log(error);
                                });


                            $scope.ingredientDisplay.push({
                                ingredient: $scope.checklistIngredients[
                                    i],
                                selected_measure: $scope
                                    .checklistIngredients[
                                        i].measure[0],
                                quantity: 1,
                            });
                        }

                        $('#add-ingredients-modal')
                            .closeModal();

                        /* cleanup checklist and search results */
                        $scope.details = undefined;
                        $scope.filts = undefined;
                        $scope.query = undefined;
                        $scope.pageSize = null;
                        $scope.currentPage = null;
                        console.log($scope.lastChecked);

                    };
                    //checks whether an ingredient is already selected or not
                    $scope.checkIfSelected = function(index) {
                        for (var i = 0; i < $scope.checklistIngredients
                            .length; i++) {
                            if ($scope.checklistIngredients[i].id ===
                                index) {
                                return true;
                            }
                        }
                        return false;
                    }

                    $scope.stepsToCreateRecipes = [''];
                    $scope.addMoreSteps = function() {
                        $scope.stepsToCreateRecipes.length += 1;
                    };



                    $scope.currentPage = 1;
                    $scope.pageSize = 6;
                    var createRecipe = function(recipe) {
                        recipeService.createRecipe(recipe)
                            .then(
                                function(response) {
                                    var id = response.recipe_id;

                                    for (var i = 0; i < $scope.ingredientDisplay
                                        .length; i++) {
                                        /* create a recipe ingred object to send to server */
                                        var recipeIngred = {
                                            recipe: id,
                                            ingredient: $scope
                                                .ingredientDisplay[
                                                    i]
                                                .ingredient
                                                .id,
                                            measure: $scope
                                                .ingredientDisplay[
                                                    i]
                                                .selected_measure
                                                .id,
                                            quantity: $scope
                                                .ingredientDisplay[
                                                    i]
                                                .quantity
                                        }

                                        recipeService.createRecipeIng(
                                                recipeIngred)
                                            .then(
                                                function(
                                                    response) {
                                                    //TODO: Add meaningful behaviour
                                                    //    on successful return
                                                }, function(
                                                    error) {
                                                    console.log(
                                                        error
                                                    );
                                                });

                                        /* upload image file to server upon id creation 
                                           Note: it was easier to do this separately since
                                           the other option was to rewrite sending data in 
                                           a form as opposed to urlencoding it */

                                    }

                                    $scope.uploadFile(id);
                                    /* Redirect to view recipe page */
                                    $location.path(
                                        '/recipes/view-recipe/' + id
                                    );
                                }, function(error) {
                                    console.log(
                                        'recipe could not be created, try again later',
                                        error);
                                });
                    };
                    
                    $scope.validateRecipe = function() {
                        if ($scope.recipe.name) {
                             $scope.finalizeRecipeCreation();
                        }
                        else {
                            $scope.recipeError = 'Enter';
                        }
                    }
                    


                    /* function called for saving the plan */
                    $scope.finalizeRecipeCreation = function($files) {
                        $scope.recipe.directions = '';
                        for (var i = 0; i < $scope.stepsToCreateRecipes
                            .length; i++) {
                            $scope.recipe.directions = $scope.recipe
                                .directions + ' \n' + $scope.stepsToCreateRecipes[
                                    i];
                        }
                        $scope.recipe.prep_time = $scope.prepHours +
                            ':' + $scope.prepMins + ':00';
                        $scope.recipe.cook_time = $scope.cookHours +
                            ':' + $scope.cookMins + ':00';
                        createRecipe($scope.recipe);
                    };


                }
                else {
                    $location.path('/');
                }
            }, function(error) {
                $location.path('/');
                console.log(error);
            });
    }
]);