'use strict';
// Controller to display search results on ingredients page

app.controller('ingredientsController', ['$scope', 'ingredientService', function($scope, ingredientService) {
    
    
    // function to search for ingredients 
    console.log('ewe');
    $scope.search = function() {
        console.log('dkjdh');
        var query = $scope.query;
        console.log(query);
        if (query) {
           ingredientService.search(query).then(function(response) {
                $scope.details = response;   //model for storing response from API                
                console.log($scope.details);                          
    },function(error) {
      console.log(error);
    });
  }

};
      // function for modal when ingredient card is clicked
  $scope.openIngredientsModal = function(index) {
        $('#modal6').openModal();
        $scope.selected = index; // stores index of every card 
    };     

  // pagination
  $scope.currentPage = 1;
  $scope.pageSize = 6; 

}]);