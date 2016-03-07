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
    $scope.modal4 = false;    


    //login object taken up from login from, ill be used to make login post request
    $scope.login={};
    //signup object taken up from signup from, ill be used to make signup post request

    $scope.signup={};        

//Function to switch the views within modal;
    $scope.switchToModal = function (number) {     // function to change the content in modal window
   
    console.log(number+typeof(number));

    //show second modal view
    
       if (number===2 && $scope.modal2 != true) {
           $scope.modal2 = true;
           $scope.modal1 = false;
           $scope.modal3 = false;
           $scope.modal3 = false;    

        }
     
    //show third modal view  
        else if (number===3 && $scope.modal3 != true) {
           $scope.modal3 = true;
           $scope.modal1 = false;
           $scope.modal2 = false;
           $scope.modal4 = false;    

        }
        
     //show fourth modal view  
        else if (number===4 && $scope.modal4 != true) {
           $scope.modal3 = false;
           $scope.modal1 = false;
           $scope.modal2 = false;
           $scope.modal4 = true;    

        }
    //show default that is first modal view    
        else {
           $scope.modal1 = true;
           $scope.modal2 = false;
           $scope.modal3 = false;
           $scope.modal4 = false;    
        }
    };
//Function to open the modal on clicking login button in the nav
    $scope.openModal = function(){
      $('#modal1').openModal();
      $scope.modal1 = true;  
      $scope.modal2 = false;
      $scope.modal3 = false;
      $scope.modal4 = false;  
    };
  //function to signup manually
  $scope.register = function(){
    
    var username = $scope.signup.username;
    var password = $scope.signup.registerPassword;
    var confirm = $scope.signup.confirmPassword;
    var email = $scope.signup.email;

    if (username && password && confirm && email) {
      AuthService.register(username, password, confirm, email).then(
        function (response) {
          console.log(response.success);
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

  if (username && password) {
    AuthService.login(username, password).then(
      function (response){
        console.log(response);
         $('#modal1').closeModal();
        $location.path('/dashboard');
      },
      function (error) {
        $scope.loginError = 'Wrong credentials, are you sure you did not signup through google or facebook?';
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
  //provider can be facebook, google-oauth2
  AuthService.socialAuth(provider).then(function(response){
    console.log(response);
    //close the modal if login is success
    $('#modal1').closeModal();
    //proceed to dashboard
    $location.path('/dashboard');
}, function(error){
  //there is an error
  $scope.loginError = error;
  $location.path('/');
  });  

};
}]);
