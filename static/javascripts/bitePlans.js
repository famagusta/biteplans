'use strict'; /* global app: true */

var app = angular.module('biteplans', [
    'satellizer', 'ngRoute', 'bw.paging',
    'ngMaterial', 'materialCalendar', 
    'angular-svg-round-progressbar',
    'ng.httpLoader'
]);

var constantData = {
    'constants': {
        'API_SERVER': 'https://www.biteplans.com/',
        userOb : {}
    }
};

app.constant('constants', constantData['constants']);

/** * @name run * @desc Update xsrf
$http headers to align with Django's defaults */
app.config(['$routeProvider', '$locationProvider', '$httpProvider',
    '$authProvider', '$controllerProvider', 'httpMethodInterceptorProvider',
    function($routeProvider, $locationProvider, $httpProvider,
        $authProvider, $controllerProvider, httpMethodInterceptorProvider) {
        
        /* whitelist auth domains to activate spinner */
        httpMethodInterceptorProvider.whitelistDomain('google.com');
        httpMethodInterceptorProvider.whitelistDomain('facebook.com');
        
        /* intercept http requests to show spinners */
        var urlsToBlacklist = ['/dashboard/event-ingredients/',
                               '/dashboard/event-recipes/',
                               '/dietplans/meal-ingredient/',
                               '/dietplans/meal-recipe/']
        $httpProvider.interceptors.push(function($q) {
            return {
             request: function(config) {
                 if(config.method !== 'PATCH'){
                    $('#processing').show();
                 }
                 return config;
              },
            
              requestError: function(config){
                  // just hiding bad request errors by closing spinner
                  $('#processing').hide();
                  return response;
              },

              response: function(response) {
                 $('#processing').hide();
                 return response;
              },
                
              responseError: function(response){
                  //just hiding bad response errors by closing spinner
                  $('#processing').hide();
                  return response;
              }
            };
          });
        
        
        $controllerProvider.allowGlobals();
        $httpProvider.interceptors.push('authInterceptor');
        
        $routeProvider.when('/', {
                controller: 'navbarController',
                templateUrl: '/static/templates/landingPage.html',
                resolve:{
                    'AuthCheck': function(AuthService){
                        return AuthService.isAuthenticated();
                    }
                }
            })
            .when('/confirm/:activation_key', {
                controller: 'confirmController',
                templateUrl: '/static/templates/confirmTemp.html'
            })
            .when('/resetpassword/:uid/:activation_key', {
                controller: 'resetController',
                templateUrl: '/static/templates/resetPassword.html'
            })
            .when('/dietplans/search', {
                controller: 'planController',
                templateUrl: '/static/templates/searchPlan.html',
                resolve:{
                    'AuthCheck': function(AuthService){
                        return AuthService.isAuthenticated();
                    }
                }
            })
            .when('/ingredients', {
                controller: 'ingredientsController',
                templateUrl: '/static/templates/searchIngredients.html',
                resolve:{
                    'AuthCheck': function(AuthService){
                        return AuthService.isAuthenticated();
                    }
                }
            })
            .when('/dashboard', {
//                controller: 'dashboardController',
                templateUrl: '/static/templates/dashboard.html'
            })
            .when('/dietplans/create/overview/:id', {
                controller: 'createPlanController',
                templateUrl: '/static/templates/createPlan.html'
            })
            .when('/dietplans/create/complete/:id', {
                controller: 'createPlanController',
                templateUrl: '/static/templates/createPlan2.html'
            })
            .when('/dietplans/view-diet-plan/:id', {
                controller: 'viewPlanController',
                templateUrl: '/static/templates/createPlan3.html'
            })
            .when('/recipes/search', {
                controller: 'recipesController',
                templateUrl: '/static/templates/recipes.html',
                resolve:{
                    'AuthCheck': function(AuthService){
                        return AuthService.isAuthenticated();
                    }
                }
            })
            .when('/recipes/create-recipes', {
                controller: 'createRecipeController',
                templateUrl: 'static/templates/createRecipe.html'
            })
            .when('/recipes/view-recipe/:id', {
                controller: 'viewRecipeController',
                templateUrl: 'static/templates/viewRecipe.html'
            })
            .when('/recipes/edit-recipe/:id', {
                controller: 'editRecipeController',
                templateUrl: 'static/templates/editRecipe.html'
            })
            .otherwise('/');
        $authProvider.facebook({
            url: constantData['constants']['API_SERVER'] +
            'authentication/sociallogin/social/jwt_user/facebook/',
            clientId: '778572508914532'
        });
        $authProvider.google({
            url: constantData['constants']['API_SERVER'] + 'authentication/sociallogin/social/jwt_user/google-oauth2/',
            clientId: '625705095605-6lemikvbb7kdh13lf3puq0r1fvcs0ukh.apps.googleusercontent.com',
            redirectUri: window.location.origin + '/'
        });
        $authProvider.authToken = 'JWT';
        $authProvider.tokenPrefix = '';
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }
]);

app.run(['$http',
    function($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName =
            'csrftoken';
    }
]);