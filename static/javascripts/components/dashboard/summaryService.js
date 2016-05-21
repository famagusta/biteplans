'use strict';

app.factory('summaryService', ['httpService', 'AuthService', '$location',
    'constants', '$q', '$window', '$rootScope', '$auth',
    function(httpService, AuthService, $location,
        constants, $q, $window, $rootScope, $auth) {

        /* CRU(D) dietplans */
        // TODO: write function to delete a diet plan
        var getUserDayPlan = function(dateString) {
            var url = '/biteplans/calendar/getPlanSummary/' + '?date=' + dateString;
            var deferred = $q.defer();
            httpService.httpGet(url)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        var updateEventIngredient = function(obj, id) {
            var url = '/biteplans/calendar/eventingredients/' + id + '/';
            var deferred = $q.defer();
            httpService.httpPatch(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };
        
        // add ingredient to a meal
        var addEventIngredient = function(obj) {
            var url = '/biteplans/calendar/eventingredients/';
            var deferred = $q.defer();
            httpService.httpPost(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };
        
        
        //* TDB
        var deleteMealIngredient = function(id) {
            var url = '/biteplans/calendar/eventingredients/' + id + '/';
            var deferred = $q.defer();
            httpService.httpDelete(url)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };


        var getShortlistIngredients = function(){
            var deferred = $q.defer();
            var url = constants['API_SERVER'] + 'biteplans/calendar/myingredients/';

            httpService.httpGet(url).then(function(response){
                deferred.resolve(response);
            }, function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        };

        var getShortlistRecipes = function(){
            var deferred = $q.defer();
            var url = constants['API_SERVER'] + 'biteplans/calendar/myrecipes/';

            httpService.httpGet(url).then(function(response){
                deferred.resolve(response);
            }, function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        };
       
        /* function to create a meal on a particular day
           to be tested*/
        var createMeal = function(obj, id) {
            var url = '/biteplans/calendar/getPlanSummary/';
            var deferred = $q.defer();
            httpService.httpPost(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };
        
        return {
            getUserDayPlan: function(dateString) {
                return getUserDayPlan(dateString);
            },
            updateEventIngredient: function(obj, id){
                return updateEventIngredient(obj, id);
            },
             deleteMealIngredient: function(obj) {
                return deleteMealIngredient(obj);
            },
            addEventIngredient: function(obj){
                return addEventIngredient(obj);
            },
            createMeal : function(obj, id){
                return createMeal(obj);
            },
            getShortlistRecipes: function(){
                return getShortlistRecipes();
            },
            getShortlistIngredients: function(){
                return getShortlistIngredients();
            }
        };

    }
]);