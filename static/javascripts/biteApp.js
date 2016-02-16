'use strict';
/* global app: true */

var app = angular.module('biteApp', [
      'ngRoute'
    ]);
/**
* @name run
* @desc Update xsrf $http headers to align with Django's defaults
*/
app.config(['$routeProvider','$locationProvider', '$httpProvider', function($routeProvider,$locationProvider,$httpProvider) {

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