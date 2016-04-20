'use strict';
app.controller('dashboardController', ['$scope','$window','$location', 'AuthService', 'ingredientService', 'Data',
               function ($scope, $window, $location, AuthService, ingredientService, Data) {
  /*if (!$window.localStorage.token) {
    $location.path('/');
    return;
  }*/
   $scope.logout = function(){
    var response = AuthService.logout();
    if(response){
      $location.path('/');
    }};
  $scope.token = $window.localStorage.token;
  $scope.username = $window.localStorage.username;
  
                   $scope.Data = Data;
                   console.log($scope.Data.Carba);
   // dashboard tabs switching
    
    $scope.tab = 1;
  
    $scope.setTab = function (tabId) {
        console.log("changing tabs");
             $scope.tab = tabId;
    };
        
    $scope.isSet = function (tabId) {
        return  $scope.tab === tabId;
    };
                   
    $scope.edit = 0;
    console.log($scope.edit);
                   
    $scope.editProfileForm = function () {
        $scope.edit = 1;
        console.log($scope.edit);
    }
        
}]);


app.controller('confirmController', ['$scope', '$window', '$location','httpService','$routeParams',
               function ($scope, $window, $location, httpService, $routeParams){ 
                $scope.content = 'Just a moment we are confirming your account';
                var init = function(){
                  var activation_key = $routeParams.activation_key;
                  var url = 'authentication/registerConfirm/' + activation_key + '/';
                  httpService.httpGet(url).then( function(response){
                    if(response.success){
                    $scope.content = response['success'];
                    $window.localStorage.token = response['token'];
                    $location.path('/dashboard');}
                    else
                      console.log(response);
                },function(error){
                  $scope.content = error;
                });
                };
                init(); 
               }]);
