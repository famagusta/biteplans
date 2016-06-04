'use strict';

app.factory('summaryService', ['httpService', 'AuthService', '$location',
    'constants', '$q', '$window', '$rootScope', '$auth',
    function(httpService, AuthService, $location,
        constants, $q, $window, $rootScope, $auth) {

        /* CRU(D) dietplans */
        // TODO: write function to delete a diet plan
        var getUserDayPlan = function(dateString) {
            var url = '/dashboard/get-plan-summary/' + '?date=' + dateString;
            var deferred = $q.defer();
            httpService.httpGet(url)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };
        
        var getUserCurrentDietplan = function(id) {
            var url = '/dashboard/follow/' + id + '/';
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
            var url = '/dashboard/event-ingredients/' + id + '/';
            var deferred = $q.defer();
            httpService.httpPatch(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };
        
        var updateEventRecipe = function(obj, id){
          var url = '/dashboard/event-recipes/' + id + '/';
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
            var url = '/dashboard/event-ingredients/';
            var deferred = $q.defer();
            httpService.httpPost(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        // add recipe to a meal
        var addEventRecipe = function(obj) {
            var url = '/dashboard/event-recipes/';
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
            var url = '/dashboard/event-ingredients/' + id + '/';
            var deferred = $q.defer();
            httpService.httpDelete(url)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        var deleteMealRecipe = function(id) {
            var url = '/dashboard/event-recipes/' + id + '/';
            var deferred = $q.defer();
            httpService.httpDelete(url)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };
        
        var deleteMeal = function(id) {
            var url = '/dashboard/get-plan-summary/' + id + '/';
            var deferred = $q.defer();
            httpService.httpDelete(url)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }


        var getShortlistIngredients = function(page){
            var deferred = $q.defer();
            if(page===undefined || page===null){
                page=1;
            }
            var url = '/dashboard/my-ingredients/'+'?page='+page;

            httpService.httpGet(url).then(function(response){
                deferred.resolve(response);
            }, function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        };

        var getShortlistRecipes = function(page){
            var deferred = $q.defer();
            
            
            if(page===undefined || page===null){
                page=1;
            }

            var url = '/dashboard/my-recipes/'+'?page='+page;

            httpService.httpGet(url).then(function(response){
                deferred.resolve(response);
            }, function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        };

        var getShortlistPlans = function(page){
            var deferred = $q.defer();
            
            
            if(page===undefined || page===null){
                page=1;
            }

            var url = '/dashboard/my-dietplans/'+'?page='+page;

            httpService.httpGet(url).then(function(response){
                deferred.resolve(response);
            }, function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        };
       
        /* function to create a meal on a particular day
           to be tested*/
        var createMeal = function(obj) {
            var url = '/dashboard/get-plan-summary/';
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
            getUserCurrentDietplan: function(dateString){
                return getUserCurrentDietplan(dateString);
            },
            updateEventIngredient: function(obj, id){
                return updateEventIngredient(obj, id);
            },
            updateEventRecipe: function(obj, id){
                return updateEventRecipe(obj, id);
            },
             deleteMealIngredient: function(obj) {
                return deleteMealIngredient(obj);
            },

            deleteMealRecipe: function(obj) {
                return deleteMealRecipe(obj);
            },
            addEventIngredient: function(obj){
                return addEventIngredient(obj);
            },
            addEventRecipe: function(obj){
                return addEventRecipe(obj);
            },
            createMeal : function(obj){
                return createMeal(obj);
            },
            deleteMeal : function (id) {
                return deleteMeal(id);  
            },
            getShortlistRecipes: function(page){
                return getShortlistRecipes(page);
            },
            getShortlistIngredients: function(page){
                return getShortlistIngredients(page);
            },
            getShortlistPlans: function(page){
                return getShortlistPlans(page);
            }
        };

    }
]);