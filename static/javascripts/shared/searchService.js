'use strict';

app.factory('searchService',
            ['httpService', '$location','constants','$q','$window', '$rootScope', '$auth', function(httpService,$location,constants,$q,$window, $rootScope, $auth){
    
        /* Function to do the search ingredients */
        var search_ingredient = function(quer) {
            var url = constants['API_SERVER'] + 'biteplans/search/';
            var deferred = $q.defer();
            httpService.httpPost(url, {
                             'query':quer,
                             'type':"ingredients"
                         }).then(
          function(response) {
            deferred.resolve(response);
            

        },
        function(response) {
            deferred.reject(response);

        });
        return deferred.promise;};
    
       // Function to search recipes
        var search_recipe = function(quer) {
            var url = constants['API_SERVER'] + 'biteplans/search/';
            var deferred = $q.defer();
            httpService.httpPost(url, {
                             'query':quer,
                             'type':"recipes"
                         }).then(
          function(response) {
            deferred.resolve(response);

        },
        function(response) {
            deferred.reject(response.data.error);
            //console.log(response);
        });
        return deferred.promise;};
                
        // Function to search plans
        var search_plan = function(quer) {
            var url = constants['API_SERVER'] + 'biteplans/search/';
            var deferred = $q.defer();
            httpService.httpPost(url, {
                             'query':quer,
                             'type':"plans"
                         }).then(
          function(response) {
            deferred.resolve(response);

        },
        function(response) {
            deferred.reject(response.data.error);
            //console.log(response);
        });
        return deferred.promise;};

    return {
        search_ingredient : function(query) {
            return search_ingredient(query);
         },
         search_recipe : function(query) {
            return search_recipe(query); 
        },
        search_plan : function(query) {
            return search_plan(query); 
        }
    };
    
}]);