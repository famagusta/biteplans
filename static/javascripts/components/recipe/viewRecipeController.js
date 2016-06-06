/* global app, $, console */

app.controller('viewRecipeController', ['$scope', 'AuthService',
    'searchService', '$location', 'recipeService', '$routeParams',
    function($scope, AuthService, searchService, $location,
        recipeService, $routeParams) {
        'use strict';
        
        $scope.recipe = {};
        $scope.parsed_directions = [];        
        $scope.AdditionalIngredientInfo = [];
        $scope.authDetails = {};
        AuthService.isAuthenticated()
            .then(function(response) {
                $scope.authDetails = response;
//                console.log(response);
            }, function(error){
            console.log(error);
        });
        
        /* get the diet plan in question from the server */
        recipeService.getRecipe($routeParams.id)
            .then(function(response) {

                $scope.recipe = response;
                $scope.parsed_directions = $scope.recipe.directions
                    .split('\n');
            
                for(var i=0; i< $scope.recipe.recipeIngredients.length; i++){
                    searchService.get_ingredient_addtnl_info($scope.recipe
                                                             .recipeIngredients[i]
                                                             .ingredient.id)
                            .then(function(response) {
                                $scope.AdditionalIngredientInfo.push(response); //model for storing response from API                
                            }, function(error) {
                                console.log(error);
                            });
                }
            }, 

            //this is not working properly

            function(error) {
                console.log(error);
            });
        
        var checkIngredNutritionQty = function(ingredient, nutrient, additionalNutrition){
            /* check if our ingredient and nutrient have valid numbers */
            var result = false;
            if(additionalNutrition !== undefined){
                if (additionalNutrition[nutrient] && ingredient.quantity && ingredient.measure.weight){
                    result = true;
                }
            } else {
                if (ingredient.ingredient[nutrient] && ingredient.quantity && ingredient.measure.weight){
                    result = true;
                }
            }
            return result;
        };
        
        $scope.calculateNutritionTotal = function(nutrient){
            var total=0;
            var servings = parseInt($scope.recipe.servings);
            //prevent divide by zero
            if (!servings){
                servings = 1;
            }
            if(Object.keys($scope.recipe).length){
                for (var i=0; i< $scope.recipe.recipeIngredients.length; i++){
                    if ( checkIngredNutritionQty($scope.recipe.recipeIngredients[i], nutrient)) {
                        total += parseFloat($scope.recipe.recipeIngredients[i]
                                        .ingredient[nutrient]) * parseFloat($scope.recipe
                                        .recipeIngredients[i].quantity) * parseFloat($scope.recipe.recipeIngredients[i]
                                        .measure.weight ) / (100 * servings * parseFloat($scope.recipe.recipeIngredients[i]
                                        .measure.amount ));
                    }
                }
            }
            return total;
        };
        
        /* calculates additional nutritional information */
        $scope.calculateAddtnlNutritionTotal = function(nutrient){
            var total=0;
            var servings = parseInt($scope.recipe.servings);
            //prevent divide by 0
            if (!servings){
                servings = 1;
            }
            for (var i=0; i< $scope.AdditionalIngredientInfo.length; i++){
                if(checkIngredNutritionQty($scope.recipe.recipeIngredients[i], nutrient, $scope.AdditionalIngredientInfo[i])){
                    total += parseFloat($scope
                            .AdditionalIngredientInfo[i][nutrient]) * parseFloat($scope
                            .recipe.recipeIngredients[i].quantity) * parseFloat($scope.recipe.recipeIngredients[i]
                            .measure.weight) / (100 * servings * parseFloat($scope.recipe.recipeIngredients[i]
                                        .measure.amount ));
                }
            }
            return total;
        };
        
        $scope.isOwner = function(){
            if($scope.authDetails.status){
                if($scope.authDetails.pk === $scope.recipe.created_by){
                    return true;
                }
            }
            return false;
        };
    }
]);