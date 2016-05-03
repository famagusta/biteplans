'use strict';

app.factory('searchService',
            ['httpService', '$location','constants','$q','$window', '$rootScope', '$auth', function(httpService,$location,constants,$q,$window, $rootScope, $auth){
    
        /* Function to do the search ingredients */
        var search_ingredient = function(quer, page) {

            var url = constants['API_SERVER'] + 'biteplans/search/';

            if(page!==undefined && page!==null)
                {
                    url += '?page'+'='+page;
                }
            var deferred = $q.defer();
            httpService.httpPost(url, {
                             'query':quer,
                             'type':'ingredients'
                         }).then(
          function(response) {
            deferred.resolve(response);
            

        },
        function(response) {
            deferred.reject(response);

        });
        return deferred.promise;};
    
       // Function to search recipes
        var search_recipe = function(quer, page) {
            var url = constants['API_SERVER'] + 'biteplans/search/';
            if(page!==undefined && page!==null)
                {
                    url += '?page'+'='+page;
                }
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
        var search_plan = function(quer, page) {
            var url = constants['API_SERVER'] + 'biteplans/search/';
            if(page!==undefined && page!==null)
                {
                    url += '?page'+'='+page;
                }
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
        search_ingredient : function(query, page) {
            return search_ingredient(query, page);
         },
         search_recipe : function(query, page) {
            return search_recipe(query, page); 
        },
        search_plan : function(query, page) {
            return search_plan(query, page); 
        }
    };
    
}]);