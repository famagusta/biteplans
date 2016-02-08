/*Handles request to user registration, login, logout*/
'use strict';
app.factory('AuthService',
            ['$http','constants','$q','$window',function($http,constants,$q,$window){
   var register = function(username, password, confirm, email) {
    // Registration logic goes here
    var deferred = $q.defer();
    var url = constants['API_SERVER'] + 'authentication/api/v1/register/';
    $http.post(url, {
                     username: username,
                     password: password,
                     confirm_password: confirm,
                     email: email,
                 }, 
{
  headers: {
    'Content-Type': 'application/json'
  }
}).then(
  function(response) {
    var token = response.data.token;
    if (token) {
  		$window.localStorage.token = token;
  		deferred.resolve(true);

  }
  else{
    // error callback
    deferred.reject('Invalid data received from server');
  }
},
function(response) {
    deferred.reject(response.data.error);
});
return deferred.promise;
};

var login = function(username, password) {
    var url = constants['API_SERVER'] + 'authentication/api/v1/login/';
    var deferred = $q.defer();
    $http.post(url, {
                     username: username,
                     password: password,
                 }, 
{
  headers: {
    'Content-Type': 'application/json'
  }
}).then(
  function(response) {
    var token = response.data.token;
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
    deferred.reject(response.data.error);
    delete $window.sessionStorage.token;

});
return deferred.promise;};

var search = function() {
    var url = constants['API_SERVER'] + 'bitespace/search';
    var deferred = $q.defer();
    $http.post(url, {
                     query: 'butter'
                 }, 
{
  headers: {
    'Content-Type': 'application/json'
  }
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

var logout = function(){
	delete $window.localStorage.token;

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
    search : function(){
      return search();
    } 
  };

}]);