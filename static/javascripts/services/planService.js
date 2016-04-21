'use strict';

app.factory('planService',
            ['httpService', 'AuthService', '$location', 'constants','$q', '$window', '$rootScope', '$auth', 
            function(httpService, AuthService, $location, constants, $q, $window, $rootScope, $auth){

            	var createPlan = function(obj){
            		var url = '/biteplans/diet/dietplans/';
            		var deferred = $q.defer();
            		httpService.httpPost(url, obj).then(function(response){
            			deferred.resolve(response);
            		}, function(error){
            			deferred.reject(error);
            		});

            		return deferred.promise;


            	};

            	var updatePlan = function(obj, id){
            		var url = '/biteplans/diet/dietplans/'+id+'/';
            		var deferred = $q.defer();
            		httpService.httpPatch(url, obj).then(function(response){
            			deferred.resolve(response);
            		}, function(error){
            			deferred.reject(error);
            		});

            		return deferred.promise;


            	};

                  var createMealPlan = function(obj){
                        var url = '/biteplans/diet/mealplans/'
                        var deferred = $q.defer();
                        httpService.httpPost(url, obj).then(function(response){
                              deferred.resolve(response);
                        }, function(error){
                              deferred.reject(error);
                        });

                        return deferred.promise;


                  };

                  var updateMealPlan = function(obj, id){
                        var url = '/biteplans/diet/mealplans/'+id+'/';
                        var deferred = $q.defer();
                        httpService.httpPut(url, obj).then(function(response){
                              deferred.resolve(response);
                        }, function(error){
                              deferred.reject(error);
                        });

                        return deferred.promise;


                  };

                  var createMealIngredient = function(obj){
                        var url = '/biteplans/diet/mealing/'
                        var deferred = $q.defer();
                        httpService.httpPost(url, obj).then(function(response){
                              deferred.resolve(response);
                        }, function(error){
                              deferred.reject(error);
                        });

                        return deferred.promise;


                  };

                  var updateMealIngredient = function(obj, id){
                        var url = '/biteplans/diet/mealing/' + id+'/'
                        var deferred = $q.defer();
                        httpService.httpPatch(url, obj).then(function(response){
                              deferred.resolve(response);
                        }, function(error){
                              deferred.reject(error);
                        });

                        return deferred.promise;


                  };

                  var createMealRecipe = function(obj){
                        var url = '/biteplans/diet/mealrecipe/'
                        var deferred = $q.defer();
                        httpService.httpPost(url, obj).then(function(response){
                              deferred.resolve(response);
                        }, function(error){
                              deferred.reject(error);
                        });

                        return deferred.promise;


                  };

                  var updateMealRecipe = function(obj, id){
                        var url = '/biteplans/diet/mealrecipe/' + id+'/'
                        var deferred = $q.defer();
                        httpService.httpPatch(url, obj).then(function(response){
                              deferred.resolve(response);
                        }, function(error){
                              deferred.reject(error);
                        });

                        return deferred.promise;


                  };

            	return {
            		createPlan : function(obj){
            			return createPlan(obj);
            		},
            		updatePlan : function(obj, id){
            			return updatePlan(obj, id);
            		}
            	};


            	}]);