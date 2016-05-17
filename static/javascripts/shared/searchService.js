'use strict';

app.factory('searchService',
            ['httpService', '$location','constants','$q','$window', '$rootScope', '$auth', function(httpService,$location,constants,$q,$window, $rootScope, $auth){
    
        /* Function to do the search ingredients */
        var search_ingredient = function(quer, page, food_group, sortby) {

            var url = constants['API_SERVER'] + 'biteplans/search/';

            if(page!==undefined && page!==null)
                {
                    url += '?page'+'='+page;
                }
            var deferred = $q.defer();

            var obj = {};
            if(food_group!==undefined && food_group!==null && food_group.length>0){
                obj = {
                    'query':quer,
                    'type':'ingredients',
                    'food_group':angular.toJson(food_group),
                };
            }
            else{
                obj = {
                    'query':quer,
                    'type':'ingredients'
                };

            }

            if(sortby!==undefined && sortby!==null){
                obj['sortby']=sortby
            }

            httpService.httpPost(url, obj).then(
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
                
        // Function to get ingredient additional info
        // in future migrate to full fledged ingredient service
        var get_ingredient_addtnl_info = function(id) {
            var url = constants['API_SERVER'] + 'biteplans/ingredient/' + id + '/';
            var deferred = $q.defer();
            httpService.httpGet(url).then(function(response){
                deferred.resolve(response);
            }, function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        };

        var shortlistIngredients = function(id){
            var deferred = $q.defer();
            var url = constants['API_SERVER'] + 'biteplans/calendar/myingredients/';

            httpService.httpPost(url, {
                'meal_ingredient':id
            }).then(function(response){
                deferred.resolve(response);
            }, function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        };

        var shortlistRecipes = function(id){
            var deferred = $q.defer();
            var url = constants['API_SERVER'] + 'biteplans/calendar/myrecipes/';

            httpService.httpPost(url, {
                'meal_recipe':id
            }).then(function(response){
                deferred.resolve(response);
            }, function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        };

    return {
        search_ingredient : function(query, page, food_group, sortby) {
            return search_ingredient(query, page, food_group, sortby);
         },
         search_recipe : function(query, page, sortby) {
            return search_recipe(query, page, sortby); 
        },
        get_ingredient_addtnl_info : function(id){
            return get_ingredient_addtnl_info(id);
        },
        search_plan : function(query, page, sortby) {
            return search_plan(query, page, sortby); 
        },
        shortlistRecipes : function(id) {
            return shortlistRecipes(id); 
        },
        shortlistIngredients : function(id) {
            return shortlistIngredients(id); 
        }
    };
    
}]);