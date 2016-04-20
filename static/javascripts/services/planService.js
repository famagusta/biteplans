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

            	return {
            		createPlan : function(obj){
            			return createPlan(obj);
            		}
            	};


            	}]);