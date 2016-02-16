'use strict';
app.controller('IndexController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {
  $scope.register = function () {
    var username = $scope.registerUsername;
    var password = $scope.registerPassword;
    var confirm = $scope.confirmPassword;
    var email = $scope.email;

    if (username && password && confirm && email) {
      AuthService.register(username, password, confirm, email).then(
        function () {
          $location.path('/confirm');
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
        $location.path('/confirm');
      },
      function (error) {
        $scope.loginError = error;
      }
    );
  } else {
    $scope.error = 'Username and password required';
  }
};

$scope.search = function(){
  var query=$scope.query
  if(query){
    AuthService.search(query).then(function(response){
      console.log(response);
    },function(error) {
      console.log(error);
    });
  };
}

 $scope.FbAuth = function(){
           var a = AuthService.loginFb()
           console.log(a)};

}]);