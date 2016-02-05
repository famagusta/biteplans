'use strict';
/*We will use app variable globally*/
/* global app: true */
app = angular.module('biteApp', [
      'ngRoute',
      'ngSanitize',
      'biteApp.authentication',
      'biteApp.layout',
      'biteApp.utils',
      'biteApp.posts',
      'biteApp.profiles'
    ]);
/**
* @name run
* @desc Update xsrf $http headers to align with Django's defaults
*/
app.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
    $routeProvider.when('/', {
  controller: 'IndexController',
  controllerAs: 'vm',
  templateUrl: '/static/templates/layout/index.html'
}).when('/register', {
      controller: 'RegisterController', 
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/register.html'
    }).when('/login', {
  controller: 'LoginController',
  controllerAs: 'vm',
  templateUrl: '/static/templates/authentication/login.html'
}).when('/+:username', {
  controller: 'ProfileController',
  controllerAs: 'vm',
  templateUrl: '/static/templates/profiles/profile.html'
}).when('/+:username/settings', {
  controller: 'ProfileSettingsController',
  controllerAs: 'vm',
  templateUrl: '/static/templates/profiles/settings.html'
}).otherwise('/');

$locationProvider.html5Mode(true);
$locationProvider.hashPrefix('!');
}]);

function run($http) {
  $http.defaults.xsrfHeaderName = 'X-CSRFToken';
  $http.defaults.xsrfCookieName = 'csrftoken';
}

app.run(run);

run.$inject = ['$http'];