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
  
   // dashboard tabs switching
    
    $scope.tab = 1;
  
    $scope.setTab = function (tabId) {
             $scope.tab = tabId;
    };
        
    $scope.isSet = function (tabId) {
        return  $scope.tab === tabId;
    };
        
}]);