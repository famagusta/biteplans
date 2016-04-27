'use strict';

app.controller('navbarController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {
   // function to check whether the person is logged in or not
    var checkLoggedIn = function () {
        AuthService.isAuthenticated().then(function(response){
//            console.log($scope.isLoggedIn);
            $scope.isLoggedIn = response.status;
//                        console.log($scope.isLoggedIn);
//            console.log(response);
        },function(error){
            $scope.isLoggedIn = false;
        })
        
    };
    checkLoggedIn();
    
//    $scope.$watch('AuthService.isAuthenticated', function(newVal, oldVal) {
//        console.log(newVal);
//        console.log(oldVal);
//    });
    
    //by default first modal viw will be visible;
    $scope.modal1 = true;  
    $scope.modal2 = false;
    $scope.modal3 = false;  
    $scope.modal4 = false;    
    

    //login object taken up from login from, ill be used to make login post request
    $scope.login={};
    //signup object taken up from signup from, ill be used to make signup post request

    $scope.signup={};

    $scope.forgot={};      

//Function to switch the views within modal;
    $scope.switchToModal = function (number) {     // function to change the content in modal window
   
//    console.log(number+typeof(number));

    //show second modal view
    
       if (number===2 && $scope.modal2 !== true) {
           $scope.modal2 = true;
           $scope.modal1 = false;
           $scope.modal3 = false;
           $scope.modal3 = false;    

        }
     
    //show third modal view  
        else if (number===3 && $scope.modal3 !== true) {
           $scope.modal3 = true;
           $scope.modal1 = false;
           $scope.modal2 = false;
           $scope.modal4 = false;    

        }
        
     //show fourth modal view  
        else if (number===4 && $scope.modal4 !== true) {
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
    //these vars are the required params
    var username = $scope.signup.username;
    var password = $scope.signup.registerPassword;
    var confirm = $scope.signup.confirmPassword;
    var email = $scope.signup.email;
//    console.log(username,password,confirm,email);

    if (username && password && confirm && email) {
      AuthService.register(username, password, confirm, email).then(
        function (response) {
//          console.log(response.success);
          $scope.registerSuccess = response.success + "Please check your email account to activate your profile";
        },
        function (error) {
//          console.log(error);
                 $scope.registerError = error.data.message;
          }
      );
    }
      else {
      $scope.registerError = 'Fields are missing';
    }
  };
//function to login using manual details. email is the required field and is taken as username
  $scope.login = function(){
    //these are required params
//    console.log('SWAG');
   var username = $scope.login.username;
  var password = $scope.login.password;
      

  if (username && password) {
    AuthService.login(username, password).then(
      function (response){
//        console.log(response);
                    console.log($scope.isLoggedIn);

          $scope.isLoggedIn = true;
          console.log($scope.isLoggedIn);
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
    
// function to logout 
    $scope.logout = function() {
        var response = AuthService.logout();
        if(response) {
                                console.log($scope.isLoggedIn);

            $scope.isLoggedIn = false;
            $location.path('/');
        }
    };

 $scope.Auth = function(provider){
  //provider can be facebook, google-oauth2
  AuthService.socialAuth(provider).then(function(response){
//    console.log(response);
      $scope.isLoggedIn = true;
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
    
    

//function to reset password, calls auth service to call forgot password feature. Email is a param
$scope.resetPassword = function(){

  var email = $scope.forgot.email;
  AuthService.forgotPassword(email).then(function(response){
    //message on success
    $scope.Message='Please check your email to reset password';
  },
  function(response){
    //message on error
    $scope.Message = 'Something went wrong, try again later';
  });

};
   
}]);