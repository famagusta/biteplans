'use strict';

app.factory('recipeService',
            ['httpService', 'AuthService', '$location', 'constants','$q', '$window', '$rootScope', '$auth', 
            function(httpService, AuthService, $location, constants, $q, $window, $rootScope, $auth){
    /* Function to do the search ingredients */
    var createRecipe = function(recipeObject){
    	var url = constants.API_SERVER+'biteplans/recipe/recipes/';
    	var deferred = $q.defer();
    	var obj = null;
    	httpService.httpPost(url, obj).then(function(response){
    		deferred.resolve(response);
    		console.log(response);

    	}, function(error){
    		console.log(error);
    		deferred.reject(error);
    	});

    	return deferred.promise;
    };

    var createRecipeIngredients = function(obj){

    	var url = constants.API_SERVER + 'biteplans/recipe/recipeingredient/';
    	var deferred = $q.defer();

    	httpService.httpPost(url, obj).then(function(response){
    		deferred.resolve(response);
    		console.log(response);

    	}, function(error){
    		console.log(error);
    		deferred.reject(error);
    	});

    	return deferred.promise;
    };




   }]);
