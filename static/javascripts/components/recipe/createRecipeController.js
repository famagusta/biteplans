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
                console.log(response);
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

                    /* search function for the ingredient modal */
                    $scope.search = function() {
                        var query = $scope.query;
                        if (query) {
                            searchService.search_ingredient(query)
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
                          add to the ingredients */
                        for (var i = $scope.ingredientDisplay.length; i <
                            $scope.checklistIngredients.length; i++
                        ) {
                            $scope.ingredientDisplay.push({
                                ingredient: $scope.checklistIngredients[
                                    i].id,
                                measure: $scope.checklistIngredients[
                                    i].measure[0].id,
                                carbohydrate: $scope.checklistIngredients[
                                    i].carbohydrate_tot,
                                fats: $scope.checklistIngredients[
                                    i].fat_tot,
                                protein: $scope.checklistIngredients[
                                    i].protein_tot,
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
                                        $scope.ingredientDisplay[
                                            i].recipe = id;
                                        recipeService.createRecipeIng(
                                                $scope.ingredientDisplay[
                                                    i])
                                            .then(
                                                function(
                                                    response) {
                                                    //TODO: Add meaningful behaviour on successful return
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

                    /* Nutritional Information calculations */
                    $scope.totalCarb = 0;
                    $scope.totalProtein = 0;
                    $scope.totalFat = 0;
                    $scope.$watch('ingredientDisplay', function() {
                        for (var i = 0; i < $scope.ingredientDisplay
                            .length; i++) {
                            $scope.totalCarb += parseFloat(
                                $scope.ingredientDisplay[
                                    i]
                                .carbohydrate *
                                $scope.ingredientDisplay[
                                    i]
                                .quantity);
                            $scope.totalProtein +=
                                parseFloat($scope.ingredientDisplay[
                                        i]
                                    .protein * $scope
                                    .ingredientDisplay[i].quantity
                                );
                            $scope.totalFat += parseFloat(
                                $scope.ingredientDisplay[
                                    i]
                                .fats * $scope.ingredientDisplay[
                                    i]
                                .quantity);
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