'use strict';
app.controller('dashboardController', ['$scope','$window','$location', 'AuthService',
               function ($scope, $window, $location, AuthService) {
  /*if (!$window.localStorage.token) {
    $location.path('/');
    return;
  }*/
   $scope .logout = function(){
    var response = AuthService.logout();
    if(response){
      $location.path('/');
    }};
  $scope.token = $window.localStorage.token;
  $scope.username = $window.localStorage.username;
  
    

}]);