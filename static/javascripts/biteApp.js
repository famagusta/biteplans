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
  templateUrl: '/static/templates/landingPage.html'
}).when('/dashboard', {
  controller: 'dashboardController',
  templateUrl: '/static/templates/dashboard.html'
}).when('/confirm', {
  controller: 'confirmController',
  templateUrl: '/static/templates/confirmTemp.html'    
}).when('/plans', {
    controller: 'planController',
    templateUrl: '/static/templates/searchPlan.html'
}).otherwise('/');

$authProvider.facebook({
    url: 'http://bitespacetest.com:8000/authentication/sociallogin/social/jwt_user/facebook/',
    clientId: '778572508914532'
});
$authProvider.google({
    url: 'http://bitespacetest.com:8000/authentication/sociallogin/social/jwt_user/google-oauth2/',
    clientId: '625705095605-6lemikvbb7kdh13lf3puq0r1fvcs0ukh.apps.googleusercontent.com',
    redirectUri: window.location.origin + '/'
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