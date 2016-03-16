'use strict';

app.controller('recipesController', ['$scope', 'AuthService', function ($scope, AuthService) {
    $scope.selected = 0;
	$scope.search_recipe = function() {
	  var query=$scope.query_recipe
	  if (query) {
	     AuthService.search_recipe(query).then(function (response) {
	     $scope.recipeDetails = response;
	     console.log($scope.recipeDetails);
	    },function(error) {
	      console.log(error);
	    });
	  }
        };
	  
    //function to open modal for viewing full content of recipe
    
    $scope.openReadMoreContent = function (index) {
          $('#modal7').openModal();
          $scope.selected = index;
          console.log($scope.selected);
    };
    
    $scope.openDetailedInfo = function (index) {
        $('#modal8').openModal();
    };
    
    // pagination
    $scope.currentPage = 1;
    $scope.pageSize = 4;

    
}]);