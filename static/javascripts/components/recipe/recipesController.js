/* global app, $, console */

app.controller('recipesController', ['$scope', 'searchService',
    'AuthService', '$rootScope', 'recipeService', 'constants', '$location',
    '$routeParams',
    function($scope, searchService, AuthService, $rootScope, recipeService, constants, $location, $routeParams) {
        'use strict';
        
        var params = $routeParams;
        
        $scope.query_recipe = params.query ? params.query : null;
        $scope.sortby = params.sortby ? params.sortby : '';
        $scope.page = params.page? parseInt(params.page) : 1;
                                     
        $scope.searchService = searchService;
        $scope.selected = 0;
        $scope.userRecipes = [];
        $scope.userRecipeRatings = [];
        $scope.recipeDetails = [];
        
        
        
        function findWithAttr(array, attr, value)
        {
            for (var i = 0; i < array.length; i += 1)
            {
                if (array[i][attr] === value)
                {
                    return i;
                }
            }
        }

        $scope.updateSortby = function(val){
            $scope.sortby = val;
            $scope.search_recipes();
        };
        
        $scope.updatePaginate = function(val){
            $scope.page = val;
            $scope.search_recipes();
        }
        
        $scope.search_recipes = function() {
            var query = $scope.query_recipe;
            var page = $scope.page;
            var sortby = $scope.sortby;
            
            $location.search('query', query); 
            $location.search('page', page);
            $location.search('sortby', sortby);
            
            if (query) {
                searchService.search_recipe(query, page, sortby)
                    .then(function(response) {
                        $scope.currentPage = page;
                        $scope.pageSize = response.total*6;
                        $scope.recipeDetails = response;
                       for (var i=0;i<$scope.recipeDetails.results.length;i++){
                           if(!$scope.recipeDetails.results[i].image){

                               $scope.recipeDetails.results[i].image = 'static/images/default_recipe.png';
                           }
                       }
                    }, function(error) {
                        console.log(error);
                    });
            }
        };
        
        
        $scope.populate_search = function(){
            if(!$scope.query_recipe){
                searchService.list_latest_recipes().then(function(response){
                    $scope.currentPage = $scope.page;
                    $scope.pageSize = response.total*6;
                    $scope.recipeDetails = response;
                   for (var i=0;i<$scope.recipeDetails.results.length;i++){
                       if(!$scope.recipeDetails.results[i].image){

                           $scope.recipeDetails.results[i].image = 'static/images/default_recipe.png';
                       }
                   }
                }, function(error){
                    console.log(error);
                })
            }
        }
        
        if($scope.query_recipe){
            $scope.search_recipes();
        } else{
            $scope.populate_search();
        }
     
        //function to open modal for viewing full content of recipe

        $scope.openReadMoreContent = function(index) {
            $('#modal7')
                .openModal();
    
        };

        $scope.openDetailedInfo = function() {
            $('#modal8')
                .openModal();
        };

        // pagination
        $scope.currentPage = 1;
        $scope.pageSize = 4;
                
        
        /*page is visible only if user is authenticated
        TODO : page is visible only to creator of plan */
            

        $scope.getUserRecipes = function(){
            if(constants.userOb.status){
                searchService.getMyRecipes().then(function(response){
                    $scope.userRecipes = response;
                }, function(error){
                    console.log(error);
                });
            }
        };

        
        
        /* check if given recipe is already in shortlisted recipe */
        $scope.checkMyRecipes = function(id){
            
            if(constants.userOb.status){
                var result = false;
                if($scope.userRecipes.results){
                    for(var i=0; i<$scope.userRecipes.results.length; i++){
                        if ($scope.userRecipes.results[i].recipe.id == id){
                            result = true;
                        }
                    }
                }
                return result;
            }else{
                //no user logged in
                return false;
            }
        };

        /* get object corresponding to given recipe in my recipe */
        $scope.getMyRecipes = function(id){
            if(constants.userOb.status){
                var result = {};
                for(var i=0; i<$scope.userRecipes.results.length; i++){
                    if ($scope.userRecipes.results[i].recipe.id == id){
                        result = $scope.userRecipes.results[i];
                    }
                }
                return result;
            }else{
                //get user to login before continuing
                return false;
            }
        };

        /* shortlist ingredient */
        $scope.shortlistRecipe = function(id){
            if(constants.userOb.status){
                if ($scope.checkMyRecipes(id)){
                    var myRecipeId = $scope.getMyRecipes(id);
                    searchService.removeFromMyRecipes(myRecipeId.id).then(
                        function(response){
                            $scope.getUserRecipes();
                    }, function(error){
                        console.log(error);
                    });
                }else{
                    searchService.shortlistRecipes(id).then(function(response){
                        $scope.getUserRecipes();
                    }, function(error){
                        console.log(error);
                    });
                }
            }else{
                /* prompt user for login */
                $rootScope.$emit('authFailure');
            }
        };


        var getUserRecipeRatings = function()
        {
            if(constants.userOb.status){
                recipeService.getUserRecipeRatings().then(function(
                    response)
                {
                    $scope.userRecipeRatings = response;
                }, function(error)
                {
                    console.log(error);
                });
            }
        };
        
        $scope.getRecipeRating = function(recipe)
        {
            // this is inefficient
            // bind result to results array
            var recipeRatingMatch = $scope.recipeDetails.results.filter(
                function(el)
                {
                    return el.id === recipe.id;
                });
            var idxRecipe = findWithAttr($scope.recipeDetails.results,
                'id', recipeRatingMatch[0].id);
            return $scope.recipeDetails.results[idxRecipe].average_rating * 20;
        };
        
        
        $scope.setRecipeRating = function(recipe, rating)
        {
            /* Handle following cases
                1. user sets rating for a recipe for the 1st time
                2. user updates rating for a recipe he rated before
                    2.a. user tries to set same rating as before
                3. the function is triggered by extra firing of 
                    star input directive -- FIX this is future
                must also check if user is logged in to do this
            */
            var normalizedRating = Math.ceil(rating / 20);
            var ratingObject = {
                rating: normalizedRating,
                recipe: recipe.id
            };
            if (!constants.userOb.status || $scope.userRecipeRatings ===
                undefined)
            {
                /* prompt user for login */
                if(!constants.userOb.current.status){
                    $rootScope.$emit('authFailure');
                }
            }else
            {
                // only authenticated users must rate plans
                if (normalizedRating > 0)
                {
                    // this takes care of erroneous firing of function
                    // find if user has rated this plan before - decide b/w post & patch
                    var userRatingMatch = $scope.userRecipeRatings.filter(
                        function(el)
                        {
                            return el.recipe === recipe.id;
                        });
                    if (userRatingMatch.length > 0)
                    {
                        // find index of recipe in results - we need to update it 
                        var idxRecipe = findWithAttr($scope.recipeDetails.results,
                            'id', userRatingMatch[0].id);
                        // case where user has previously rated this plan
                        if (userRatingMatch[0].rating !==
                            normalizedRating)
                        {
                            //case where user is updating his/her rating
                            recipeService.updateRecipeRating(
                                ratingObject, userRatingMatch[0]
                                .id).then(function(response)
                            {
                                //update user ratings array
                                getUserRecipeRatings();
                                // update recipe rating
                                var recipe2Update = {};
                                recipeService.getRecipe(
                                    userRatingMatch[0].recipe
                                ).then(function(
                                    response)
                                {
                                    $scope.recipeDetails.results[
                                            idxRecipe
                                            ] =
                                        response;
                                }, function(error)
                                {
                                    console.log(
                                        error);
                                });
                            }, function(error)
                            {
                                console.log(error);
                            });
                        }
                    }
                    else
                    {
                        // case where this is a fresh rating
                        recipeService.createRecipeRating(
                            ratingObject).then(function(response)
                        {
                            // update user ratings array
                            getUserRecipeRatings();
                        }, function(error)
                        {
                            console.log(error);
                        });
                    }
                }
            }
        };
        
        $scope.checkAuth4RecipeCreate = function(){
            if(constants.userOb.status){
                $location.path('/recipes/create-recipes');
            }
            else{
                $rootScope.$emit('authFailure');
            }
        };
        
        $scope.getFilterLabel = function(filter){
            var filterNames ={
                'average_rating': "Rating",
                'carbohydrate_tot': "Carbohydrates",
                'protein_tot': "Proteins",
                'fat_tot': "Fats",
                'energy_kcal': "Calories",
                'sugar_tot': "Sugar",
                'fiber_tot': "Fiber"
            };
            return filterNames[filter];
        };
        
        $scope.openRecipeDetails = function(recipeId){
            $location.path("recipes/view-recipe/" + recipeId +'/');    
        };
        
        $scope.getTotalDuration = function(recipe){
            /* return total time : cook + prep of a recipe */
            var cook_time = moment.duration(recipe.cook_time);
            var prep_time = moment.duration(recipe.prep_time);
            var tot_time = moment.duration(cook_time + prep_time);
            return tot_time.hours() + " hour " + tot_time.minutes() + " mins" ;
        };
        
        $scope.viewRecipe = function(recipeId){
            $location.path('/recipes/view-recipe/' + recipeId + '/').reload();
        }
        
        if(constants.userOb.status){
            $scope.getUserRecipes();
            getUserRecipeRatings();
        }
    }
]);