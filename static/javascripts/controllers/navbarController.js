'use strict';

app.controller('navbarController', ['$scope', '$location', function ($scope, $location) {
    $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1) || '/';
        return page === currentRoute ? 'active' : '';
    };
    //by default first modal viw will be visible;
    $scope.modal1 = true;  
    $scope.modal2 = false;
    $scope.modal3 = false;        

//Function to switch the views within modal;
    $scope.switchToModal = function (number) {     // function to change the content in modal window
   
    console.log(number+typeof(number));

    //show second modal view
    
       if (number===2) {
           $scope.modal2 = true;
           $scope.modal1 = false;
           $scope.modal3 = false;
        }
     
    //show third modal view  
        else if (number===3) {
           $scope.modal3 = true;
           $scope.modal1 = false;
           $scope.modal2 = false;
        }
    //show default that is first modal view    
        else {
           $scope.modal1 = true;
           $scope.modal2 = false;
           $scope.modal3 = false;
        }
    };
//Function to open the modal on clicking login button in the nav
    $scope.openModal = function(){
      $('#modal1').openModal();
    };
    
}]);
