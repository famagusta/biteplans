'use strict';

app.factory('planService', ['httpService', 'AuthService', '$location',
    'constants', '$q', '$window', '$rootScope', '$auth',
    function(httpService, AuthService, $location,
        constants, $q, $window, $rootScope, $auth) {

        /* CRU(D) dietplans */
        // TODO: write function to delete a diet plan
        var createPlan = function(obj) {
            var url = '/dietplans/dietplan/';
            var deferred = $q.defer();
            httpService.httpPost(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        var getDietPlan = function(id) {
            var url = '/dietplans/dietplan/' + id + '/';
            var deferred = $q.defer();
            httpService.httpGet(url)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        var copyDayPlan = function(obj){
            var url = '/dietplans/copy-day-plan/';
            var deferred = $q.defer();
            httpService.httpPost(url, obj).then(function(response){

                deferred.resolve(response);

            }, function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        };

        var updatePlan = function(obj, id) {
            var url = '/dietplans/dietplan/' + id + '/';
            var deferred = $q.defer();
            httpService.httpPatch(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        /* (C)R(UD) day plans */
        // create an entire day separately
        // what about update and delete
        var getdayplan = function(diet, day, week) {
            //url looks like /biteplans/plan/dayplan/8/1/1/
            var url = '/dietplans/plan/day-plan/' + diet + '/' + day +
                '/' + week + '/';
            var deferred = $q.defer();
            httpService.httpGet(url)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        };


        /* C(R)UD meal plan */
        // is there any sense to get a specific meal plan? - Retrieve
        var createMealPlan = function(obj) {
            var url = '/dietplans/meal-plan/';
            var deferred = $q.defer();
            httpService.httpPost(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        var updateMealPlan = function(obj, id) {
            var url = '/dietplans/meal-plan/' + id + '/';
            var deferred = $q.defer();
            httpService.httpPatch(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        var deleteMealPlan = function(id) {
            var url = '/dietplans/meal-plan/' + id + '/';
            var deferred = $q.defer();
            httpService.httpDelete(url)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };


        /* C(R)UD MealIngredients */
        // is there any sense to get a specific mealingredient? Probably not
        var createMealIngredient = function(obj) {
            var url = '/dietplans/meal-ingredient/';
            var deferred = $q.defer();
            httpService.httpPost(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        var updateMealIngredient = function(obj, id) {
            var url = '/dietplans/meal-recipe/' + id + '/';
            var deferred = $q.defer();
            httpService.httpPatch(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        var deleteMealIngredient = function(id) {
            var url = '/dietplans/meal-ingredient/' + id + '/';
            var deferred = $q.defer();
            httpService.httpDelete(url)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        /* C(R)UD MealRecipes */
        // is there any sense to get a specific mealrecipes? Probably not

        var createMealRecipe = function(obj) {
            var url = '/dietplans/meal-recipe/';
            var deferred = $q.defer();
            httpService.httpPost(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        var updateMealRecipe = function(obj, id) {
            var url = '/dietplans/meal-recipe/' + id + '/';
            var deferred = $q.defer();
            httpService.httpPatch(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        var deleteMealRecipe = function(id) {
            var url = '/dietplans/meal-recipe/' + id + '/';
            var deferred = $q.defer();
            httpService.httpDelete(url)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };
        
        /* function that makes a user follow a dietplan given a start date*/
        var followDietPlan = function(obj){
            var url = '/dashboard/follow/';
            var deferred = $q.defer();
            /* cast our parameters into an object */
            httpService.httpPost(url,obj)
                .then(function(response){
                    deferred.resolve(response);
                }, function(error){
                    deferred.reject(error);
                });
            return deferred.promise;
        };
        
        /* function to capture user rating of a dietplan */
        var createDietPlanRating = function(obj){
            var url = '/dietplans/plan-rating/';
            var deferred = $q.defer();
            /* cast our parameters into an object */
            httpService.httpPost(url,obj)
                .then(function(response){
                    deferred.resolve(response);
                }, function(error){
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        /* function to update a users existing rating for a plan */
        var updateDietPlanRating = function(obj, id){
            var url = '/dietplans/plan-rating/' + id + '/';
            var deferred = $q.defer();
            /* cast our parameters into an object */
            httpService.httpPost(url,obj)
                .then(function(response){
                    deferred.resolve(response);
                }, function(error){
                    deferred.reject(error);
                });
            return deferred.promise;
        };
        
        /* get user plan ratings */
        var getUserDietPlanRatings = function(){
            var url = '/dietplans/plan-rating/';
            var deferred = $q.defer();
            /* cast our parameters into an object */
            httpService.httpGet(url)
                .then(function(response){
                    deferred.resolve(response);
                }, function(error){
                    deferred.reject(error);
                });
            return deferred.promise;
        };
        
        


        return {
            createPlan: function(obj) {
                return createPlan(obj);
            },
            getDietPlan: function(id) {
                return getDietPlan(id);
            },
            updatePlan: function(obj, id) {
                return updatePlan(obj, id);
            },
            getdayplan: function(o, i, d) {
                return getdayplan(o, i, d);
            },
            createMealPlan: function(obj) {
                return createMealPlan(obj);
            },
            updateMealPlan: function(obj, id) {
                return updateMealPlan(obj, id);
            },
            createMealIngredient: function(obj) {
                return createMealIngredient(obj);
            },
            updateMealIngredient: function(obj, id) {
                return updateMealIngredient(obj, id);
            },
            createMealRecipe: function(obj) {
                return createMealRecipe(obj);
            },
            updateMealRecipe: function(obj, id) {
                return updateMealRecipe(obj, id);
            },
            deleteMealPlan: function(obj) {
                return deleteMealPlan(obj);
            },
            deleteMealIngredient: function(obj) {
                return deleteMealIngredient(obj);
            },
            deleteMealRecipe: function(obj) {
                return deleteMealRecipe(obj);
            },
            followDietPlan : function(obj){
                return followDietPlan(obj);
            },

            copyDayPlan: function(obj){
                return copyDayPlan(obj);
            },
            createDietPlanRating: function(obj){
                return createDietPlanRating(obj)                
            },
            updateDietPlanRating: function(obj, id){
              return updateDietPlanRating(obj, id)  
            },
            getUserDietPlanRatings: function(){
                return getUserDietPlanRatings()                
            }
        };

    }
]);