'use strict';

app.controller('recipesController', ['$scope', 'searchService',
    'AuthService',
    function($scope, searchService, AuthService) {
        $scope.searchService = searchService;
        $scope.selected = 0;
        $scope.query_recipe = '';
        
        $scope.search_recipe = function(page, sortby) {
            var query = $scope.query_recipe;
            if (query) {
                searchService.search_recipe(query, page, sortby)
                    .then(function(response) {
                        $scope.recipeDetails = response;
                   for (var i=0;i<$scope.recipeDetails.results.length;i++){
                       if($scope.recipeDetails.results[i].image){
                           $scope.recipeImage = $scope.recipeDetails.results[i].image;
                       }
                       else {
                           $scope.recipeImage = 'static/images/default_recipe.png';
                       }
                   }
                    }, function(error) {
                        console.log(error);
                    });
            }
        };
        
     
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
        
        
        
        AuthService.isAuthenticated()
            .then(function(response) {
                    var isAuth = response.status;
                    /*page is visible only if user is authenticated
                    TODO : page is visible only to creator of plan */
                    if (isAuth) {
                        $scope.userRecipes = []
        
                        $scope.getUserRecipes = function(){
                            searchService.getMyRecipes().then(function(response){
                                $scope.userRecipes = response;
                            }, function(error){
                                console.log(error);
                            });
                        }
                        
                        $scope.getUserRecipes();
                        /* check if given recipe is already in shortlisted recipe */
                        $scope.checkMyRecipes = function(id){
                            var result = false;
                            for(var i=0; i<$scope.userRecipes.length; i++){
                                if ($scope.userRecipes[i].recipe.id == id){
                                    result = true;
                                }
                            }
                            return result;
                        }

                        /* get object corresponding to given recipe in my recipe */
                        $scope.getMyRecipes = function(id){
                            var result = {};
                            for(var i=0; i<$scope.userRecipes.length; i++){
                                if ($scope.userRecipes[i].recipe.id == id){
                                    result = $scope.userRecipes[i];
                                }
                            }
                            return result;
                        }
                        
                        /* shortlist ingredient */
                        $scope.shortlistRecipe = function(id){
                            if ($scope.checkMyRecipes(id)){
                                var myRecipeId = $scope.getMyRecipes(id);
                                searchService.removeFromMyRecipes(myRecipeId.id).then(
                                    function(response){
                                        $scope.getUserRecipes();
                                }, function(error){
                                    console.log(error);
                                })
                            }else{
                                searchService.shortlistRecipes(id).then(function(response){
                                    $scope.getUserRecipes();
                                }, function(error){
                                    console.log(error);
                                })
                            }
                        }
                    }
        });
        
        

    }
]);