'use strict';

app.controller('recipesController', ['$scope', 'searchService',
    function($scope, searchService) {
        $scope.selected = 0;
        $scope.query_recipe = '';
        
        $scope.search_recipe = function() {
            var query = $scope.query_recipe
            if (query) {
                searchService.search_recipe(query)
                    .then(function(response) {
                        $scope.recipeDetails = response;
                    console.log($scope.recipeDetails);
                   for (var i=0;i<$scope.recipeDetails.results.length;i++){
                       if($scope.recipeDetails.results[i].image){
                           $scope.recipeImage = $scope.recipeDetails.results[i].image;
                       }
                       else {
                           $scope.recipeImage = 'static/images/default_recipe.png';
                       }
                   }
                    }, function(error) {
                        console.log(error);
                    });
            }
        };
        
     
        //function to open modal for viewing full content of recipe

        $scope.openReadMoreContent = function(index) {
            $('#modal7')
                .openModal();
            $scope.selected = index;
            console.log($scope.selected);
        };

        $scope.openDetailedInfo = function() {
            $('#modal8')
                .openModal();
        };

        // pagination
        $scope.currentPage = 1;
        $scope.pageSize = 4;

    }
]);