/* global app, $, console */

app.factory('recipeService',
            ['httpService', 'AuthService', '$location', 'constants','$q', '$window', '$rootScope', '$auth', '$http',
            function(httpService, AuthService, $location, constants, $q, $window, $rootScope, $auth, $http){
            'use strict';
                
    /* Function to do the search ingredients */
    var createRecipe = function(recipeObject){
    	var url = '/recipes/recipe/';
    	var deferred = $q.defer();
    	httpService.httpPost(url, recipeObject).then(function(response){
    		deferred.resolve(response);

    	}, function(error){
    		deferred.reject(error);
    	});

    	return deferred.promise;
    };

//    var getImageDataURL = function(url, imageType = 'image/jpeg'){
//      return $http.get(url, {responseType: 'arraybuffer'}).then((res) => {
//        let blob = new Blob([res.data], {type: imageType});
//        return (window.URL || window.webkitURL).createObjectURL(blob);
//      });
//    };
                
    var getRecipesMadeByMe = function(page){
        if(page===undefined || page===null){
            page=1;
        }
        var url = '/recipes/recipe/?page='+page;
        var deferred = $q.defer();
        httpService.httpGet(url).then(function(response){
            deferred.resolve(response);

        }, function(error){
            deferred.reject(error);
        });

        return deferred.promise;
    };

    var uploadRecipeImage = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('image', file);
        
        var deferred = $q.defer();
        httpService.httpPatchFile(uploadUrl, fd).then(function(response){
    		deferred.resolve(response);

    	}, function(error){
    		console.log(error);
    		deferred.reject(error);
    	});

    	return deferred.promise;
    };
        

    
    var updateRecipe = function(obj, id) {
            var url = '/recipes/recipe/' + id + '/';
            var deferred = $q.defer();
            httpService.httpPatch(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };
                
    var updateRecipeIngredient = function(obj, id) {
            var url = '/recipes/recipe-ingredient/' + id + '/';
            var deferred = $q.defer();
            obj.ingredient = obj.ingredient.id;
            obj.measure = obj.measure.id;
            httpService.httpPatch(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };
                                  
    var deleteRecipeIngredient = function(id) {
            var url = '/recipes/recipe-ingredient/' + id + '/';
            var deferred = $q.defer();
            httpService.httpDelete(url)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };
                                  
    
                
    var createRecipeIngredients = function(obj) {

    	var url = '/recipes/recipe-ingredient/';
    	var deferred = $q.defer();

    	httpService.httpPost(url, obj).then(function(response){
    		deferred.resolve(response);

    	}, function(error){
    		console.log(error);
    		deferred.reject(error);
    	});

    	return deferred.promise;
    };
                
    var getRecipe = function(id){
        var url = '/recipes/recipe/' + id + '/';
        var deferred = $q.defer();
        httpService.httpGet(url).then(function(response){
            deferred.resolve(response);
        }, function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    };
                
    /* function to capture user rating of a dietplan */
    var createRecipeRating = function(obj){
        var url = '/recipes/recipe-rating/';
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
    var updateRecipeRating = function(obj, id){
        var url = '/recipes/recipe-rating/' + id + '/';
        var deferred = $q.defer();
        /* cast our parameters into an object */
        httpService.httpPatch(url,obj)
            .then(function(response){
                deferred.resolve(response);
            }, function(error){
                deferred.reject(error);
            });
        return deferred.promise;
    };

    /* get user plan ratings */
                
    var getUserRecipeRatings = function(){
        var url = '/recipes/recipe-rating/';
        var deferred = $q.defer();
        httpService.httpGet(url)
            .then(function(response){
                deferred.resolve(response);
            }, function(error){
                deferred.reject(error);
            });
        return deferred.promise;
    };
                
                

    return {

    	createRecipe : function(obj){
    		return createRecipe(obj);
    	},

		createRecipeIng : function(obj){
    		return createRecipeIngredients(obj);
       },
        
        getRecipe : function(id){
            return getRecipe(id);
        },
        uploadRecipeImage : function(file, url){
            return uploadRecipeImage(file, url);
        },
        
        updateRecipe: function(obj, id){
            return updateRecipe(obj, id);
        },
        
        updateRecipeIngredient: function(obj, id){
            return updateRecipeIngredient(obj, id);
        },
        
        deleteRecipeIngredient: function(id){
            return deleteRecipeIngredient(id);
        },
        getRecipesMadeByMe : function(page){
            return getRecipesMadeByMe(page);
        },
        getUserRecipeRatings : function(){
            return getUserRecipeRatings();  
        },
        updateRecipeRating : function(obj, id){
            return updateRecipeRating(obj, id);
        },
        createRecipeRating : function(obj){
            return createRecipeRating(obj);
        }

    };

   }]);