'use strict';
/* global app: true */

var app = angular.module('biteApp', [
      'ngRoute'
    ]);
/**
* @name run
* @desc Update xsrf $http headers to align with Django's defaults
*/
app.config(['$routeProvider','$locationProvider', '$httpProvider', function($routeProvider, $locationProvider , $httpProvider) {

$httpProvider.interceptors.push('authInterceptor');

    $routeProvider.when('/', {
    controller: 'IndexController',
    templateUrl: '/static/templates/landingPage.html'
})
    .when('/plans', {
    controller: 'planController',
    templateUrl: '/static/templates/searchPlan.html'
})
    .when('/ingredients', {
    controller: 'ingredientsController',
    templateUrl: '/static/templates/searchIngredients.html'
})
    .when('/dashboard', {
    controller: 'dashboardController',
    templateUrl: '/static/templates/dashboard.html'
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
    'API_SERVER':'http://127.0.0.1:8000/',
  }
};

app.constant('constants',constantData['constants']);