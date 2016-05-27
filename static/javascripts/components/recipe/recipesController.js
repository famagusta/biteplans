'use strict';

app.controller('recipesController', ['$scope', 'searchService',
    'AuthService',
    function($scope, searchService, AuthService) {
        $scope.searchService = searchService;
        $scope.selected = 0;
        $scope.query_recipe = '';
        $scope.isAuth = '';
        $scope.userRecipes = [];
        
        AuthService.isAuthenticated()
            .then(function(response) {
                $scope.isAuth = response.status;
                $scope.getUserRecipes();
            }, function(error){
            console.log(error);
        });
        
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
                
        
        /*page is visible only if user is authenticated
        TODO : page is visible only to creator of plan */
            

        $scope.getUserRecipes = function(){
            if($scope.isAuth){
                searchService.getMyRecipes().then(function(response){
                    $scope.userRecipes = response;
                }, function(error){
                    console.log(error);
                });
            }else{
                // do something meaningful
                console.log("please login to continue");
            }
        }

        
        
        /* check if given recipe is already in shortlisted recipe */
        $scope.checkMyRecipes = function(id){
            if($scope.isAuth){
                var result = false;
                for(var i=0; i<$scope.userRecipes.length; i++){
                    if ($scope.userRecipes[i].recipe.id == id){
                        result = true;
                    }
                }
                return result;
            }else{
                //do something meaningful - prompt user to login
                console.log("please login to continue");
            }
        }

        /* get object corresponding to given recipe in my recipe */
        $scope.getMyRecipes = function(id){
            if($scope.isAuth){
                var result = {};
                for(var i=0; i<$scope.userRecipes.length; i++){
                    if ($scope.userRecipes[i].recipe.id == id){
                        result = $scope.userRecipes[i];
                    }
                }
                return result;
            }else{
                //get user to login before continuing
                console.log("please login to continue");
            }
        }

        /* shortlist ingredient */
        $scope.shortlistRecipe = function(id){
            if($scope.isAuth){
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
            }else{
                // prompt user to login
                console.log("please login to continue");
            }
        }



    }
]);