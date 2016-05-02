'use strict';

app.controller('createRecipeController', ['$scope', 'AuthService',
    '$routeParams',
    'searchService', '$location', 'recipeService',
    function($scope, AuthService, $routeParams, searchService,
        $location,
        recipeService) {

        AuthService.isAuthenticated()
            .then(function(response) {
                var isAuthenticated = response.status;
                if (isAuthenticated) {

                    /* initialize scope variables to interact with DOM */

                    // stores the entries from the checkbox prior to saving into
                    // recipe ingredients
                    $scope.checklistIngredients = [];

                    // stores the ingredients added to the recipe so far
                    $scope.ingredientDisplay = [];

                    //stores the last ingredient added to the recipe
                    $scope.lastChecked = null;

                    //variables to gather additional information
                    $scope.prep_hours = 0;
                    $scope.prep_mins = 0;
                    $scope.cook_hours = 0;
                    $scope.cook_mins = 0;

                    // route to navigate to view the recipe after creation
                    $scope.view_recipe = '/viewRecipe/' +
                        $routeParams.id;

                    /* Nutritional Information Storage Box */
                    // maybe use 'NA' instead of zero??
                    $scope.nutrition_info = {
                        total_calories: 0,
                        total_carbs: 0,
                        total_protein: 0,
                        total_fat: 0,
                        fiber: 0,
                        sugar: 0,
                        polyunsaturated_fat: 0,
                        monounsaturated_fat: 0,
                        saturated_fat: 0,
                        cholesterol: 0,
                        sodium: 0,
                        calcium: 0,
                        iron: 0,
                        vitamin_a: 0, //IU units
                        vitamin_c: 0,
                        vitamin_d: 0,
                        vitamin_e: 0,
                        
                    };

                    /* search function for the ingredient modal */
                    $scope.search = function() {
                        var query = $scope.query;
                        if (query) {
                            searchService.search_ingredient(
                                    query)
                                .then(
                                    function(response) {
                                        /* model for storing response from API */
                                        $scope.details =
                                            response;
                                    }, function(error) {
                                        // TODO : Handle error cases better
                                        console.log(error);
                                    });
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
                    $scope.$watch('checklistIngredients', function(
                        newVal, oldVal) {
                        if (newVal.length > 0) {
                            $scope.lastChecked = newVal[
                                newVal.length - 1];
                        }
                    }, true);

                    /* function to remove an ingredient from the recipe */
                    $scope.removeIngredient = function(element) {
                        // remove ingredient from checklist array
                        var index = $scope.checklistIngredients
                            .indexOf(element);
                        $scope.checklistIngredients.splice(
                            index, 1);

                        // remove ingredient from recipe ingredients
                        var index = $scope.checklistIngredients
                            .indexOf(element);
                        $scope.ingredientDisplay.splice(index,
                            1);
                    };


                    /* add contents from the modal to the recipe */
                    $scope.addContents = function() {
                        /*loop over the checklist mode (nutrient value) and
                          add to the ingredients 
                          also, add the weight of each ingredient measure to 
                          use in calculating total nutrient*/
                        for (var i = $scope.ingredientDisplay.length; i <
                            $scope.checklistIngredients.length; i++
                        ) {
                            $scope.ingredientDisplay.push({
                                ingredient: $scope.checklistIngredients[
                                    i],
                                selected_measure: $scope
                                    .checklistIngredients[
                                        i].measure[0],
                                quantity: 1
                            });
                        }
                        $('#add-ingredients-modal')
                            .closeModal();

                        /* cleanup checklist and search results */
                        $scope.lastChecked = null;
                        $scope.details = [];

                    };

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
                                        var recipeIngred ={
                                            recipe: id,
                                            ingredient: $scope.ingredientDisplay[i].ingredient
                                            .id,
                                            measure: $scope.ingredientDisplay[i]
                                            .selected_measure.id,
                                            quantity: $scope.ingredientDisplay[i].quantity
                                        } 
                                        
                                        recipeService.createRecipeIng(recipeIngred)
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
                                    }

                                    /* Redirect to view recipe page */
                                    $location.path(
                                        '/viewRecipe/' + id
                                    );
                                }, function(error) {
                                    console.log(
                                        'recipe could not be created, try again later',
                                        error);
                                });
                    };

                    /* Nutritional Information calculations based on changes to
                    selected ingredients */

                    $scope.$watch('ingredientDisplay', function(
                        newVal, oldVal) {
                        console.log($scope.ingredientDisplay);
                        /* recalculate nutritional information */
                        $scope.nutrition_info.total_carbs = 0;
                        $scope.nutrition_info.total_protein = 0;
                        $scope.nutrition_info.total_fat = 0;
                        for (var i = 0; i < $scope.ingredientDisplay
                            .length; i++) {
                            $scope.nutrition_info.total_carbs +=
                                $scope.ingredientDisplay[
                                    i].ingredient
                                .carbohydrate_tot *
                                $scope.ingredientDisplay[
                                    i].quantity *
                                $scope.ingredientDisplay[
                                    i].selected_measure
                                .weight / (100 * parseInt($scope.recipe.servings));
                            $scope.nutrition_info.total_protein +=
                                $scope.ingredientDisplay[
                                    i].ingredient
                                .protein_tot *
                                $scope.ingredientDisplay[i]
                                .quantity *
                                $scope.ingredientDisplay[i]
                                .selected_measure.weight /
                                (100 * parseInt($scope.recipe.servings));
                            $scope.nutrition_info.total_fat +=
                                $scope.ingredientDisplay[
                                    i].ingredient
                                .fat_tot * $scope.ingredientDisplay[
                                    i]
                                .quantity *
                                $scope.ingredientDisplay[
                                    i].selected_measure
                                .weight / (100 * parseInt($scope.recipe.servings));
                        }

                    }, true);


                    /* function called for saving the plan */
                    $scope.finalizeRecipeCreation = function() {
                        $scope.recipe.directions = '';
                        for (var i = 0; i < $scope.stepsToCreateRecipes
                            .length; i++) {
                            $scope.recipe.directions = $scope.recipe
                                .directions + ' \n' + $scope.stepsToCreateRecipes[
                                    i];
                        }
                        $scope.recipe.prep_time = $scope.prep_hours +
                            ':' + $scope.prep_mins + ':00';
                        $scope.recipe.cook_time = $scope.cook_hours +
                            ':' + $scope.cook_mins + ':00';
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