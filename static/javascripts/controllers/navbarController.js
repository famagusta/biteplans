'use strict';

app.controller('navbarController', ['$scope', '$location', function ($scope, $location) {
    $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1) || '/';
        return page === currentRoute ? 'active' : '';
    };
    
    $scope.modal1 = true;  
    $scope.modal2 = false;
    $scope.modal3 = false;        

    $scope.switchToModal = function (number) {     // function to change the content in modal window
   
    console.log(number+typeof(number));
    
       if (number == 2) {
           $scope.modal2 = true;
           $scope.modal1 = false;
           $scope.modal3 = false;
        }
       
        else if (number == 3) {
           $scope.modal3 = true;
           $scope.modal1 = false;
           $scope.modal2 = false;
        }
        
        else {
           $scope.modal1 = true;
           $scope.modal2 = false;
           $scope.modal3 = false;
        }
    }
    
}]);
