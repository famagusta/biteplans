'use strict';
app.controller('IndexController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {
  $scope.register = function () {
    var username = $scope.registerUsername;
    var password = $scope.registerPassword;
    var confirm = $scope.confirmPassword;
    var email = $scope.email;
    AuthService.search().then(

        function(data){
          console.log(data);

        },
        function(error){
          console.log(error);
        });


    if (username && password && confirm && email) {
      AuthService.register(username, password, confirm, email).then(
        function () {
          $location.path('/dashboard');
        },
        function (error) {
          $scope.registerError = error;
        }
      );
    } else {
      $scope.registerError = 'fields are missing';
    }
  };

  $scope.login = function () {
  var username = $scope.loginUsername;
  var password = $scope.loginPassword;

  if (username && password) {
    AuthService.login(username, password).then(
      function () {
        $location.path('/dashboard');
      },
      function (error) {
        $scope.loginError = error;
      }
    );
  } else {
    $scope.error = 'Username and password required';
  }
};



}]);