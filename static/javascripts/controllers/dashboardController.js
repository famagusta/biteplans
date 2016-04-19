'use strict';
app.controller('dashboardController', ['$scope','$window','$location', 'AuthService', 'ingredientService',
               function ($scope, $window, $location, AuthService, ingredientService) {
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
  

   // dashboard tabs switching
    
    $scope.tab = 1;
  
    $scope.setTab = function (tabId) {
        console.log("changing tabs");
             $scope.tab = tabId;
    };
        
    $scope.isSet = function (tabId) {
        return  $scope.tab === tabId;
    };
                   
    $scope.myIngredientsArray = [];
                   
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
