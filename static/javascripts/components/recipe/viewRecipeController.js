'use strict';

app.controller('viewRecipeController', ['$scope', 'AuthService',
    'searchService', '$location', 'recipeService', '$routeParams',
    function($scope, AuthService, searchService, $location,
        recipeService, $routeParams) {

        $scope.recipe = {};
        $scope.parsed_directions = [];        
        $scope.AdditionalIngredientInfo = [];
        
        /* get the diet plan in question from the server */
        recipeService.getRecipe($routeParams.id)
            .then(function(response) {

                $scope.recipe = response;
                $scope.parsed_directions = $scope.recipe.directions
                    .split('\n');
            console.log($scope.recipe.recipeIngredients.length);
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
            }, function(error) {
                console.log(error);
            });
        
        
        $scope.calculateNutritionTotal = function(nutrient){
            var total=0;
            var servings = parseInt($scope.recipe.servings);
            //prevent divide by zero
            if (!servings){
                servings = 1;
            }
            if(Object.keys($scope.recipe).length){
                for (var i=0; i< $scope.recipe.recipeIngredients.length; i++){
                    total += parseFloat($scope.recipe.recipeIngredients[i].ingredient[nutrient])
                        * parseFloat($scope.recipe.recipeIngredients[i].quantity)
                        * parseFloat($scope.recipe.recipeIngredients[i].measure.weight )
                        / (100 * servings);
                }
            }
            return total;
        }
        
        
        /* calculates additional nutritional information */
        $scope.calculateAddtnlNutritionTotal = function(nutrient){
            var total=0;
            var servings = parseInt($scope.recipe.servings);
            //prevent divide by 0
            if (!servings){
                servings = 1;
            }
            for (var i=0; i< $scope.AdditionalIngredientInfo.length; i++){
                total += parseFloat($scope.AdditionalIngredientInfo[i][nutrient]) 
                    * parseFloat($scope.recipe.recipeIngredients[i].quantity)
                    * parseFloat($scope.recipe.recipeIngredients[i].measure.weight) 
                    / (100 * servings)
            }
            return total;
        }
        
    }
]);