'use strict';

app.controller('viewRecipeController', ['$scope', 'AuthService',
    'ingredientService', '$location', 'recipeService', '$routeParams',
    function($scope, AuthService, ingredientService, $location,
        recipeService, $routeParams) {

        $scope.recipe = {};
        $scope.parsed_directions = [];

        /* get the diet plan in question from the server */
        recipeService.getRecipe($routeParams.id)
            .then(function(response) {

                $scope.recipe = response;
                $scope.parsed_directions = $scope.recipe.directions
                    .split('\n');

            }, function(error) {
                console.log(error);
            });

    }
]);