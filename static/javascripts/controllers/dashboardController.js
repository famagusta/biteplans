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

app.controller('confirmController', ['$scope', '$window', '$location','httpService',
               function ($scope, $window, $location, httpService){ 
                if (!$window.localStorage.token) {
                    $location.path('/');
                    return;
                }
                $scope.content = 'Just a moment we are confirming your account';
                var init = function(){
                  var url = 'authentication/registerConfirm';
                  httpService.httpGet(url).then( function(response){
                    $scope.content = response['success'];
                    $location.path('/dashboard');
                },function(error){
                  $scope.content = error;
                  $location.path('/confirm');
                });
                };
                init(); 
               }]);
