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

                  var getdayplan = function(diet,day,week){

                        var url = '/biteplans/plan/dayplan/'+diet+'/'+day+'/'+week+'/';
                        var deferred = $q.defer();
                        httpService.httpGet(url).then(function(response){
                              deferred.resolve(response);

                        }, function(response){
                              deferred.reject(response);
                        });

                        return deferred.promise;

                  };

                  var createMealPlan = function(obj){
                        var url = '/biteplans/diet/mealplans/';
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
                        httpService.httpPatch(url, obj).then(function(response){
                              deferred.resolve(response);
                        }, function(error){
                              deferred.reject(error);
                        });

                        return deferred.promise;


                  };

                  var createMealIngredient = function(obj){
                        var url = '/biteplans/diet/mealing/';
                        var deferred = $q.defer();
                        httpService.httpPost(url, obj).then(function(response){
                              deferred.resolve(response);
                        }, function(error){
                              deferred.reject(error);
                        });

                        return deferred.promise;


                  };

                  var updateMealIngredient = function(obj, id){
                        var url = '/biteplans/diet/mealing/' + id+'/';
                        var deferred = $q.defer();
                        httpService.httpPatch(url, obj).then(function(response){
                              deferred.resolve(response);
                        }, function(error){
                              deferred.reject(error);
                        });

                        return deferred.promise;


                  };

                  var createMealRecipe = function(obj){
                        var url = '/biteplans/diet/mealrecipe/';
                        var deferred = $q.defer();
                        httpService.httpPost(url, obj).then(function(response){
                              deferred.resolve(response);
                        }, function(error){
                              deferred.reject(error);
                        });

                        return deferred.promise;


                  };

                  var updateMealRecipe = function(obj, id){
                        var url = '/biteplans/diet/mealrecipe/' + id+'/';
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
                        },
                        getdayplan : function(o, i, d){
                              return getdayplan(o, i, d);
                        },
                        createMealPlan : function(obj){
                              return createMealPlan(obj);
                        },
                        updateMealPlan : function(obj, id){
                              return updateMealPlan(obj, id);
                        },
                        createMealIngredient : function(obj){
                              return createMealIngredient(obj);
                        },
                        updateMealIngredient : function(obj, id){
                              return updateMealIngredient(obj, id);
                        },
                        createMealRecipe : function(obj){
                              return createMealRecipe(obj);
                        },
                        updateMealRecipe : function(obj, id){
                              return updateMealRecipe(obj, id);
                        },
            	};


            	}]);