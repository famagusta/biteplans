'use strict';

app.controller('navbarController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {
    $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1) || '/';
        return page === currentRoute ? 'active' : '';
    };
    //by default first modal viw will be visible;
    $scope.modal1 = true;  
    $scope.modal2 = false;
    $scope.modal3 = false;
    $scope.login={};
    $scope.signup={};        

//Function to switch the views within modal;
    $scope.switchToModal = function (number) {     // function to change the content in modal window
   
    console.log(number+typeof(number));

    //show second modal view
    
       if (number===2 && $scope.modal2 != true) {
           $scope.modal2 = true;
           $scope.modal1 = false;
           $scope.modal3 = false;
        }
     
    //show third modal view  
        else if (number===3 && $scope.modal3 != true) {
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
      $scope.modal1 = true;  
      $scope.modal2 = false;
      $scope.modal3 = false;  
    };
  //function to signup manually
  $scope.register = function(){
    
    var username = $scope.signup.username;
    var password = $scope.signup.password;
    var confirm = $scope.signup.confirmPassword;
    var email = $scope.signup.email;

    if (username && password && confirm && email) {
      AuthService.register(username, password, confirm, email).then(
        function (response) {
          console.log(response);
          $('#modal1').closeModal();
          $location.path('/confirm');
        },
        function (error) {
          console.log(error);
                 $scope.registerError = error;
          }
      );
    }
      else {
      $scope.registerError = 'Fields are missing';
    }
  };

  $scope.login = function(){
 
  console.log('here');
  var username = $scope.login.username;
  var password = $scope.login.password;

  console.log(username  + " " + password);

  if (username && password) {
    console.log('here test');
    AuthService.login(username, password).then(
      function (response){
        console.log(response);
         $('#modal1').closeModal();
        $location.path('/confirm');
      },
      function (error) {
        $scope.loginError = error;
      }
    );
  } else {
    $scope.loginError = 'Username and password required';
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
  }
};

 $scope.Auth = function(provider){
  $('#modal1').closeModal();
  AuthService.socialAuth(provider);
};
    
}]);
