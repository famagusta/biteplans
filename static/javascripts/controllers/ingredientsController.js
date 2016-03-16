'use strict';
// Controller to display search results on ingredients page

app.controller('ingredientsController', ['$scope', 'AuthService', function($scope, AuthService) {
    
    
    // function to search for ingredients 
    
    $scope.search = function() {
        var query = $scope.query;
        if (query) {
            AuthService.search(query).then(function(response) {
                $scope.details = response;   //model for storing response from API                
                console.log($scope.details);                          
    },function(error) {
      console.log(error);
    });
  }

  // function for modal when ingredient card is clicked
  $scope.openIngredientsModal = function(index) {
        $('#modal6').openModal();
        $scope.selected = index; // stores index of every card 
    };     

};

  // pagination
  $scope.currentPage = 1;
  $scope.pageSize = 6; 

}]);