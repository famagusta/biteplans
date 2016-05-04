'use strict';

app.factory('profileService',
            ['httpService', 'AuthService', '$location', 'constants','$q', '$window', '$rootScope', '$auth', '$http',
            function(httpService, AuthService, $location, constants, $q, $window, $rootScope, $auth, $http){
    /* Function to do the search ingredients */
    
                
    var getProfile = function(id){
        /* return the user profile based on a jwt token - 
        user gets it on login or signup*/
        var url = 'authentication/api/v1/jwt_user/';
        var deferred = $q.defer();
        httpService.httpGet(url).then(function(response){
            deferred.resolve(response);
        }, function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    }
    
    var updateSavedPlan = function(obj, id ) {
            var url = 'authentication/api/v1/register/' + id + '/';
        console.log(obj);
            var deferred = $q.defer();
            httpService.httpPatch(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
    }
      
     var uploadProfileImage = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('image_path', file);
        var deferred = $q.defer();

        httpService.httpPatchFile(uploadUrl, fd).then(function(response){
    		deferred.resolve(response);
    		console.log(response);

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
            return uploadProfileImage(id, file)
        },
        updateSavedPlan : function(obj, id){
            return updateSavedPlan(obj, id)
        }
    };
}]);
