/*Handles request to user registration, login, logout*/
'use strict';

app.factory('httpService',['$http', '$q', function($http,$q){
  var toparams = function(obj) {
    var p = [];
    for (var key in obj) {
        p.push(key + '=' + encodeURIComponent(obj[key]));
    }
    return p.join('&');
};

    var httpPost = function(url,params){
      params = toparams(params);
      var promise = $http.post(url, params,{
        headers:{
              'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(
      function(response){
        return response.data;
      });
      return promise;
    };

    var httpGet = function(url){
      var promise = $http.get(url, {
        headers:{
              'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(
      function(response){
        return response.data;
      });
      return promise;
    };


    return{
      httpPost : function(url,params){
        return httpPost(url,params);
      },
      httpGet : function(url,params){
        return httpGet(url,params);
      }

    };
}]);

/* Takes care of authentication functionality and also stores user object for sharing among different controllers*/
app.factory('AuthService',
            ['httpService', '$location','constants','$q','$window', '$rootScope', '$auth', function(httpService,$location,constants,$q,$window, $rootScope, $auth){
   var register = function(username, password, confirm, email) {
    // Registration logic goes here
    var deferred = $q.defer();
    var url = constants['API_SERVER'] + 'authentication/api/v1/register/';
    var userString = {
                     'username': username,'password': password,'confirm_password': confirm,'email': email};

    httpService.httpPost(url, userString).then(
      function(response) {
          var token = response.token;
          if (token) {
  		        $window.localStorage.token = token;
  		        deferred.resolve(true);
            }
          else{
              deferred.reject('Invalid data received from server');
            }
          },
          function(response) {
              deferred.reject(response.error);
          });
          return deferred.promise;
          };

/* Login logic goes here {This is normal login, not social login }*/
var login = function(username, password) {
    var url = constants['API_SERVER'] + 'authentication/api/v1/login';
    var deferred = $q.defer();
    httpService.httpPost(url, {
                     'username': username,
                     'password': password,
                 }).then(
  function(response) {
    var token = response.token;
    console.log(response);
    if (token) {
  		$window.localStorage.token = token;
  		deferred.resolve(true);

  }
  else{
    // error callback
    deferred.reject('Invalid data received from server');
    delete $window.sessionStorage.token;

  }
},
function(response) {
    deferred.reject(response.error);
    delete $window.sessionStorage.token;

});
return deferred.promise;};


/* Function to do the search ingredients */
var search = function(quer) {
    var url = constants['API_SERVER'] + 'bitespace/search';
    var deferred = $q.defer();
    httpService.httpPost(url, {
                     'query':quer,
                 }).then(
  function(response) {
    console.log(response);
    deferred.resolve(true);

},
function(response) {
    deferred.reject(response.data.error);
    console.log(response);

});
return deferred.promise;};

/* function to logout for normally signed in user */
var logout = function(){
	delete $window.localStorage.token;

};

/*User resource for different controllers */
var userOb = {};
userOb.current = {};
userOb.set_user = function(response){
  if (response){
    userOb.current = response.data;
} else {
    userOb.current = {
        'username': null,
        'first_name': null,
        'last_name': null,
        'email': null,
        'social_thumb': '{% static "anonymous.png" %}'
    };
}
};

/*Function for social login */
var loginSocial = function(provider){
  console.log($auth.getToken());
  $auth.authenticate(provider).then(function(response){
  $auth.setToken(response.data.token);
  userOb.set_user(response);
  console.log(response);
  $location.path('/confirm');
}).catch(function(data) {
      var err_msg = "Something went wrong, maybe the user is already loggedin?";
      var reply = {'error':data,'message':err_msg};
      logout();
      $location.path('/');
      console.log(reply);
      });
};

var getCurrentUserDetails = function(){
if ($auth.getToken()){
      httpService.httpGet('http://bitespacetest.com:8000/authentication/api/v1/jwt_user/').then(function(response){
          userOb.set_user(response);
      });
  }
};

  return {
    register: function(username, password, confirm, email) {
      return register(username, password, confirm, email);
    },
    login: function(username, password){
      return login(username, password);

    },
    logout : function(){
    	logout();
    	return 'User has been logged out';

    },
    search : function(query){
      return search(query);
    },

    socialAuth : loginSocial,

    getAuthdUser : getCurrentUserDetails
  };

}]);

/*Do not touch*/
// // since we are resolving a thirdparty response, 
//         // we need to do so in $apply   
//   var reslve = function(errval, retval, deferred) {
//       $rootScope.$apply(function() {
//           if (errval) {
//         deferred.reject(errval);
//           } else {
//         retval.connected = true;
//               deferred.resolve(retval);
//           }
//       });
//         };

//   var fbLogin = function(){
//       var deferred = $q.defer();
//             //first check if we already have logged in
//       FB.getLoginStatus(function(response) {
//           if (response.status === 'connected') {
//               // the user is logged in and has authenticated your
//         // app
//         console.log('fb user already logged in');
//         console.log(FB.appId);
//         deferred.resolve(response);
//     } else {
//         // the user is logged in to Facebook, 
//         // but has not authenticated your app
//         FB.login(function(response){
//             if(response.authResponse){
//           console.log('fb user logged in');
//           reslve(null, response, deferred);
//       }else{
//           console.log('fb user could not log in');
//           reslve(response.error, null, deferred);
//       }
//         });
//      }
//        });
      
//        return deferred.promise;
//   };

//   var loginViaFb = function(){
//            fbLogin().then(function(response){
//                //we come here only if JS sdk login was successful so lets 
//                //make a request to our new view. I use Restangular, one can
//                //use regular http request as well.
//                console.log(response);
//                var reqObj = {'access_token': response.authResponse.accessToken,
//                           'backend': 'facebook'};
//                console.log(reqObj);
//                httpService.httpPost(constants['API_SERVER']+'authentication/sociallogin/', reqObj).then(function(response) {
//                   return response;
//                }, function(response) { /*error*/
//                    return response;
//                });  
//            });
//         };
