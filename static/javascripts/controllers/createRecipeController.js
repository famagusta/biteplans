'use strict';

app.controller('createRecipeController', ['$scope', 'AuthService', '$routeParams',
    'ingredientService', '$location', 'recipeService',
    function($scope, AuthService, $routeParams, ingredientService, $location,
        recipeService) {

        AuthService.isAuthenticated()
            .then(function(response) {
                var isAuthenticated = response.status;
                if (isAuthenticated) {

                    /* why are there two variables to track?? */
                    // one is for checklist and other is for adding
                    $scope.nutrientValue = [];
                    $scope.lastChecked = null;
                    $scope.prep_hours = 0;
                    $scope.prep_mins = 0;
                    $scope.cook_hours = 0;
                    $scope.cook_mins = 0;
                    $scope.view_recipe = '/viewRecipe/'+$routeParams.id;
               
                    /* search function for the ingredient modal */
                    $scope.search = function() {
                        var query = $scope.query;
                        if (query) {
                            ingredientService.search(query)
                                .then(
                                    function(response) {
                                        /* model for storing response from API */
                                        $scope.details =
                                            response;
                                        //console.log($scope.details);
                                    }, function(error) {
                                        console.log(error);
                                    });
                        }
                    };

                    /* function that opens the modal */
                    $scope.openCreateRecipeModal = function() {
                        $scope.lastChecked = null;
                        $('#create-recipe-modal')
                            .openModal();
                        //$scope.currentMealPlanName = string;
                    };

               
                    $scope.$watch('nutrientValue', function(newVal, oldVal) {
                        if(newVal.length>0){
                            $scope.lastChecked = newVal[newVal.length - 1];
                        }
                    }, true);
                    $scope.ingredientDisplay = [];

                    /* function to remove an ingredient from the recipe */
                    $scope.removeIngredient = function(element) {
                        var index = $scope.nutrientValue.indexOf(
                            element);
                        $scope.nutrientValue.splice(index, 1);
                        var index = $scope.nutrientValue.indexOf(
                            element);
                        $scope.ingredientDisplay.splice(index, 1);
                    };
                    
                    /* SAVED MEAL??? code left overs from create dietplans?? */
                    $scope.removeIngredientsFromSavedMeal =
                        function(element) {
                            $scope.ingredientDisplay.splice(element,
                                1);
                        };
                    
                    /* add contents from the modal to the recipe */
                    $scope.addContents = function() {
                        /*loop over the checklist mode (nutrient value) and
                          add to the ingredients */
                        for (var i = $scope.ingredientDisplay.length; i <
                            $scope.nutrientValue.length; i++) {
                            $scope.ingredientDisplay.push({
                                ingredient: $scope.nutrientValue[i].id,
                                measure: $scope.nutrientValue[i].measure[0].id,
                                carbohydrate: $scope.nutrientValue[i].carbohydrate_tot,
                                fats: $scope.nutrientValue[i].fat_tot,
                                protein: $scope.nutrientValue[i].protein_tot,
                                quantity: 1
                            });
                        }
                        console.log($scope.ingredientDisplay);
                        console.log($scope.nutrientValue);

                        $('#create-recipe-modal').closeModal();
                        $scope.lastChecked = null;
                        /* cleanup checklist and search results */
                        //$scope.nutrientValue = [];
                        $scope.details = [];
                        
                    };
                    
                    $scope.stepsToCreateRecipes = [''];
                    $scope.addMoreSteps = function() {
                        $scope.stepsToCreateRecipes.length += 1;
                    };
                    
                    $scope.currentPage = 1;
                    $scope.pageSize = 6;
                    var createRecipe = function(recipe) {
                        console.log(recipe);
                        recipeService.createRecipe(recipe)
                            .then(
                                function(response) {
                                    var id = response.recipe_id;
                                    console.log(id);
                                    for (var i = 0; i < $scope.ingredientDisplay
                                        .length; i++) {
                                        $scope.ingredientDisplay[
                                            i].recipe = id;
                                        recipeService.createRecipeIng(
                                                $scope.ingredientDisplay[i])
                                            .then(
                                                function(response) {
                                                    //console.log(response);
                                                    //$location = $scope.view_recipe
                                                }, function(error) {
                                                    console.log(
                                                        error
                                                    );
                                                });
                                    }
                                    $location.path('/viewRecipe/'+id);
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
                            console.log($scope.ingredientDisplay[i]);
                            $scope.totalCarb += parseFloat(
                                $scope.ingredientDisplay[i]
                                    .carbohydrate *
                                $scope.ingredientDisplay[i]
                                    .quantity);
                            $scope.totalProtein +=
                                parseFloat($scope.ingredientDisplay[i]
                                        .protein * $scope
                                    .ingredientDisplay[i].quantity
                                );
                            $scope.totalFat += parseFloat(
                                $scope.ingredientDisplay[i]
                                    .fats * $scope.ingredientDisplay[i]
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