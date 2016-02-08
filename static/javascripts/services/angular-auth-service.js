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

    var httpGet = function(url,params){
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


    return{
      httpPost : function(url,params){
        return httpPost(url,params);
      },
      httpGet : function(url,params){
        return httpGet(url,params);
      }

    };
}]);

app.factory('AuthService',
            ['httpService','constants','$q','$window',function(httpService,constants,$q,$window){
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

var login = function(username, password) {
    var url = constants['API_SERVER'] + 'authentication/api/v1/login';
    var deferred = $q.defer();
    httpService.httPost(url, {
                     'username': username,
                     'password': password,
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
    search : function(query){
      return search(query);
    } 
  };

}]);