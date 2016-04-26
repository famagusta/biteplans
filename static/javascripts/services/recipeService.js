'use strict';

app.factory('recipeService',
            ['httpService', 'AuthService', '$location', 'constants','$q', '$window', '$rootScope', '$auth', 
            function(httpService, AuthService, $location, constants, $q, $window, $rootScope, $auth){
    /* Function to do the search ingredients */
    var createRecipe = function(recipeObject){
    	var url = constants.API_SERVER+'biteplans/recipe/recipes/';
    	var deferred = $q.defer();
    	var obj = null;
    	httpService.httpPost(url, recipeObject).then(function(response){
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
                
    var getRecipe = function(id){
        var url = 'biteplans/recipe/recipes/' + id + '/';
        var deferred = $q.defer();
        httpService.httpGet(url).then(function(response){
            deferred.resolve(response);
        }, function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    }
                
                

    return {

    	createRecipe : function(obj){
    		return createRecipe(obj);
    	},

		createRecipeIng : function(obj){
    		return createRecipeIngredients(obj);
       },
        
        getRecipe : function(id){
            return getRecipe(id);
        }

    };




   }]);
