/* global app, $, console */

app.factory('profileService',
            ['httpService', 'AuthService', '$location', 'constants','$q', '$window', '$rootScope', '$auth', '$http',
            function(httpService, AuthService, $location, constants, $q, $window, $rootScope, $auth, $http){
    'use strict';
    /* Function to do the search ingredients */


    var getProfile = function(id){
        /* return the user profile based on a jwt token - 
        user gets it on login or signup*/
        var url = '/authentication/api/v1/jwt_user/';
        var deferred = $q.defer();
        httpService.httpGet(url).then(function(response){
            deferred.resolve(response);
        }, function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    var getUserProfile = function(id ) {
        //?? what is this doing here/??
        // this is incorrectly name and does god knows what
            var url = '/authentication/api/v1/register/' + id + '/';
            var deferred = $q.defer();
            httpService.httpGet(url)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
    };
                
    var updateSavedPlan = function(obj, id ) {
        //?? what is this doing here/??
        // this is incorrectly name and does god knows what
            var url = '/authentication/api/v1/register/' + id + '/';
            var deferred = $q.defer();
            httpService.httpPatch(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
    };
      
     var uploadProfileImage = function(id, file){
         //seperate service to save a profile image
        var fd = new FormData();
        fd.append('image_path', file);
         var url = '/authentication/api/v1/register/' + id + '/';
        var deferred = $q.defer();

        httpService.httpPatchFile(url, fd).then(function(response){
    		deferred.resolve(response);

    	}, function(error){
    		console.log(error);
    		deferred.reject(error);
    	});

    	return deferred.promise;
    };
                
    var updateProfile = function(id, obj){
        var url = '/authentication/api/v1/register/' + id + '/';
        var deferred = $q.defer();
        httpService.httpPatch(url, obj).then(function(response){
    		deferred.resolve(response);

    	}, function(error){
    		console.log(error);
    		deferred.reject(error);
    	});

    	return deferred.promise;
    };
                

    return {
        
        getProfile : function(id){
            return getProfile(id);
        },
        uploadProfileImage : function(id, file){
            return uploadProfileImage(id, file);
        },
        updateProfile : function(id, obj){
            return updateProfile(id, obj);
        },
        updateSavedPlan : function(obj, id){
            return updateSavedPlan(obj, id);
        },
        getUserProfile : function(id){
            return getUserProfile(id);
        }
    };
}]);
