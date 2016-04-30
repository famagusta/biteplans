/*Handles request to user registration, login, logout*/
'use strict';
// $q makes a promise which can be fulfilled or not fulfilled. so a = $q.defer(), it can resolve or reject
//a.resolve() means success, a.reject() means not fulfilled

app.factory('httpService',['$http', '$q', function($http,$q){
  //encodes params into correct format 
  var toparams = function(obj) {
    var p = [];
    for (var key in obj) {
        p.push(key + '=' + encodeURIComponent(obj[key]));
    }
    return p.join('&');
};
//makes a post using url and params as parameter
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

    var httpPut = function(url,params){
      params = toparams(params);
      var promise = $http.put(url, params,{
        headers:{
              'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(
      function(response){
        return response.data;
      });
      return promise;
    };

    var httpPatch = function(url, params){
      params = toparams(params);
      var promise = $http.patch(url, params,{
        headers:{
              'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(
      function(response){
        return response.data;
      });
      return promise;
    };

//http get method wrapper
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

    var httpDelete = function(url){
        var promise = $http.delete(url, {
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
        },
        httpPut : function(url,params){
            return httpPut(url,params);
        },
        httpPatch : function(url,params){
            return httpPatch(url,params);
        },
        httpDelete : function(url,params){
            return httpDelete(url,params);
        },
    };
}]);

/* Takes care of authentication functionality and also stores user object for sharing among different controllers*/
app.factory('AuthService',
            ['httpService', '$location','constants','$q','$window', '$rootScope', '$auth', function(httpService,$location,constants,$q,$window, $rootScope, $auth){
   var register = function(username, password, confirm, email) {
    // Registration logic goes here

    //constants is a angular.constant service which will contain all the constants for our app
    //being used 
    var deferred = $q.defer();
    var url = constants['API_SERVER'] + 'authentication/api/v1/register/';
    var userString = {
                     'username': username,'password': password,'confirm_password': confirm,'email': email};

    httpService.httpPost(url, userString).then(
      function(response) {
          if (response.success) {
  		        deferred.resolve(response);
            }
          else{
              deferred.reject('Invalid data received from server');
            }
          },
          function(response) {
              deferred.reject(response);
          });
          return deferred.promise;
          };

/* Login logic goes here {This is normal login, not social login }*/
var login = function(username, password) {
    var url = constants['API_SERVER'] + 'authentication/api/v1/login/';
    var deferred = $q.defer();
    httpService.httpPost(url, {
                     'email': username,
                     'password': password,
                 }).then(
  function(response) {
    var token = response.token;
    if (token) {
  		$window.localStorage.token = token;
  		deferred.resolve(response);

  }
  else{
    // error callback
    deferred.reject('Invalid data received from server');
    $auth.removeToken();

  }
},
function(response) {
    deferred.reject(response);
    $auth.removeToken();

});
return deferred.promise;};


/* Function to do the search ingredients */
//var search = function(quer) {
//    var url = constants['API_SERVER'] + 'bitespace/search';
//    var deferred = $q.defer();
//    httpService.httpPost(url, {
//                     'query':quer,
//                 }).then(
//  function(response) {
//    deferred.resolve(response);
//
//},
//function(response) {
//    deferred.reject(response);
//
//});
//return deferred.promise;};
//
/* function to logout for normally signed in user */
var logout = function(){
	$auth.removeToken();
  userOb.set_user();

};
//
//var search_recipe = function(quer) {
//    var url = constants['API_SERVER'] + 'bitespace/recipe_search';
//    var deferred = $q.defer();
//    httpService.httpPost(url, {
//                     'query':quer,
//                 }).then(
//  function(response) {
//    deferred.resolve(response);
//
//},
//function(response) {
//    deferred.reject(response.data.error);
//    console.log(response);
//
//});
//return deferred.promise;};
/*User resource for sharing between different controllers */
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
  var prom = $q.defer();
  $auth.authenticate(provider).then(function(response){
  $auth.setToken(response.data.token);
  userOb.set_user(response);
  prom.resolve(response.data);
}).catch(function(data) {
      logout();
      prom.reject('Something went wrong, try again later');
      userOb.set_user();
      });

return prom.promise;
};

//stores the info of current user to share amongst different controllers.
var getCurrentUserDetails = function(){
if ($auth.getToken()){
      httpService.httpGet('http://bitespacetest.com:8000/authentication/api/v1/jwt_user/').then(function(response){
          userOb.set_user(response);
      });
  }
};

//Function for forgot password and this sends email to user with activation link
var resetPassword = function(email) {
  //url to be hit
    var url = constants['API_SERVER'] + 'authentication/forgot/password/reset/';
    //promise to be fulfilled
    var deferred = $q.defer();
    httpService.httpPost(url, {
                     'email':email,
                 }).then(
  function(response) {
    //promise is fulfilled
    deferred.resolve(response.data);

},
function(response) {
  //error, promise not fulfilled :(
    deferred.reject(response.data);

});
//return promise, promise gets things done
return deferred.promise;};


var isAuthenticated = function(){
  var url = constants['API_SERVER'] + 'authentication/loginstatus/';
    console.log(url);
  var deferred = $q.defer();
  httpService.httpGet(url).then(function(response){
    deferred.resolve(response);
  }, function(error){
    deferred.reject(error);
  });

    return deferred.promise;
};

//return all these features as function
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
    isAuthenticated : function(){
      return isAuthenticated();
    },

    socialAuth : loginSocial,

    getAuthdUser : getCurrentUserDetails,

    forgotPassword : resetPassword,
  };

}]);

