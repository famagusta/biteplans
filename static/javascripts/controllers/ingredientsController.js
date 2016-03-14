'use strict';
// Controller to display search results on ingredients page

app.controller('ingredientsController', ['$scope', 'AuthService', function($scope, AuthService) {
    
    
    // function to search for ingredients 
    
    $scope.search = function() {
        var query = $scope.query;
        if (query) {
            AuthService.search(query).then(function(response) {
                $scope.details = response;   //model for storing response from API                
                                 
                //modal content dynamically changes

                //pagination
                
                               
    },function(error) {
      console.log(error);
    });
  }
  $scope.openMan = function(index) {
        $('#modal6').openModal();
       $scope.selected = index;
    };     

};
    
     
        
    
}]);