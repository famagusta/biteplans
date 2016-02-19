'use strict';
/* global app: true */

var app = angular.module('biteApp', [
      'satellizer',
      'ngRoute'
    ]);
/**
* @name run
* @desc Update xsrf $http headers to align with Django's defaults
*/
app.config(['$routeProvider','$locationProvider', '$httpProvider', '$authProvider', function($routeProvider,$locationProvider,$httpProvider,$authProvider) {

$httpProvider.interceptors.push('authInterceptor');

    $routeProvider.when('/', {
  controller: 'IndexController',
  templateUrl: '/static/templates/indexView.html'
}).when('/login', {
  controller: 'IndexController',
  templateUrl: '/static/templates/login.html'
}).when('/dashboard', {
  controller: 'DashboardController',
  templateUrl: '/static/templates/dashboard.html'
}).when('/confirm', {
  controller: 'confirmController',
  templateUrl: '/static/templates/confirmTemp.html'
}).otherwise('/');

$authProvider.facebook({
    url: 'http://bitespacetest.com:8000/authentication/sociallogin/social/jwt_user/facebook/',
    clientId: '778572508914532'
});
$authProvider.google({
    url: 'http://bitespacetest.com:8000/authentication/sociallogin/social/jwt_user/google-oauth2/',
    clientId: '1085148051855-038mu2fo2vha95b666r8lunao125l4k7.apps.googleusercontent.com'
});
$authProvider.authToken = 'JWT';
$authProvider.tokenPrefix = '';

$locationProvider.html5Mode(true);
$locationProvider.hashPrefix('!');
}]);

app.run(['$http',function($http){
  $http.defaults.xsrfHeaderName = 'X-CSRFToken';
  $http.defaults.xsrfCookieName = 'csrftoken';
}]);

var constantData = {
  'constants': {
    'API_SERVER':'http://bitespacetest.com:8000/',
  }
};

app.constant('constants',constantData['constants']);