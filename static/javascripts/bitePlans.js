'use strict'; /* global app: true */
var app = angular.module('biteplans', [
    'satellizer', 'ngRoute', 'bw.paging',
    'angular-svg-round-progressbar', 'ngMaterial', 'materialCalendar'
]);

var constantData = {
    'constants': {
        'API_SERVER': 'http://bitespacetest.com:8000/',
    }
};

app.constant('constants', constantData['constants']);

/** * @name run * @desc Update xsrf
$http headers to align with Django's defaults */
app.config(['$routeProvider', '$locationProvider', '$httpProvider',
    '$authProvider', '$controllerProvider',
    function($routeProvider, $locationProvider, $httpProvider,
        $authProvider, $controllerProvider) {
        $controllerProvider.allowGlobals();
        $httpProvider.interceptors.push('authInterceptor');
        $routeProvider.when('/', {
                controller: 'navbarController',
                templateUrl: '/static/templates/landingPage.html'
            })
            .when('/dashboard', {
                controller: 'dashboardController',
                templateUrl: '/static/templates/dashboard.html'
            })
            .when('/confirm/:activation_key', {
                controller: 'confirmController',
                templateUrl: '/static/templates/confirmTemp.html'
            })
            .when('/resetpassword/:uid/:activation_key', {
                controller: 'resetController',
                templateUrl: '/static/templates/resetPassword.html'
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
            })
            .when('/plan/:id', {
                controller: 'createPlanController',
                templateUrl: '/static/templates/createPlan.html'
            })
            .when('/plan2/:id', {
                controller: 'createPlanController',
                templateUrl: '/static/templates/createPlan2.html'
            })
            .when('/plan3/:id', {
                controller: 'createPlanController',
                templateUrl: '/static/templates/createPlan3.html'
            })
            .when('/recipes', {
                controller: 'recipesController',
                templateUrl: '/static/templates/recipes.html'
            })
            .when('/createRecipes', {
                controller: 'createRecipeController',
                templateUrl: 'static/templates/createRecipe.html'
            })
            .when('/viewRecipe/:id', {
                controller: 'viewRecipeController',
                templateUrl: 'static/templates/viewRecipe.html'
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
