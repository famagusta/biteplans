'use strict';
// Controller to display search results on ingredients page

app.controller('ingredientsController', ['$scope', 'searchService', 'AuthService',
    function($scope, searchService, AuthService) {
        // function to search for ingredients 
        $scope.foodgroup=[];
        $scope.openModal ={};
        $scope.isAuth = '';
        $scope.userIngredients = [];
        
        AuthService.isAuthenticated()
            .then(function(response) {
                $scope.isAuth = response.status;
                $scope.getUserIngredients();
            }, function(error){
            console.log(error);
        });
        
        $scope.searchService = searchService;

        $scope.$watchCollection('foodgroup', function (newVal, oldVal) {
            $scope.search(1, $scope.sortby);
         });

        $scope.search = function(page, sortby) {
            if($scope.query !== undefined){
                $scope.details = null;

            $scope.sortby = sortby
            
            var query = $scope.query;
            console.log(query, page, sortby);
            if (query!== undefined && $scope.foodgroup.length >0) {
                searchService.search_ingredient(query, page, $scope.foodgroup, sortby)
                    .then(function(response) {
                        $scope.details = response;
                        $scope.filts = response.filters; //model for storing response from API                
                        console.log($scope.details);
                        // pagination
                        $scope.currentPage = page;
                        $scope.pageSize = response.total*6;
                    }, function(error) {
                        console.log(error);
                    });
            }
            else if (query!== undefined && $scope.foodgroup.length ===0) {
                searchService.search_ingredient(query, page, null, sortby)
                    .then(function(response) {
                        $scope.details = response;
                        $scope.filts = response.filters; //model for storing response from API                
                        console.log($scope.details);
                        // pagination
        $scope.currentPage = page;
        $scope.pageSize = response.total*6;
                    }, function(error) {
                        console.log(error);
                    });
            }
            else{
                searchService.search_ingredient(query, page, null, sortby)
                    .then(function(response) {
                        $scope.details = response;
                        $scope.filts = response.filters; //model for storing response from API                
                        console.log($scope.details);
                        // pagination
                        $scope.currentPage = page;
                        $scope.pageSize = response.total*6;
                    }, function(error) {
                        console.log(error);
                    });
            }

        }};
        // function for modal when ingredient card is clicked
        $scope.openIngredientsModal = function(index) {
            $scope.selected = index;
            $scope.openModal.measure = $scope.details.results[$scope.selected].measure[0];
            $('#modal6').openModal();
            // stores index of every card 
        };
        
        $scope.calculateIngredientInfo = function(nutrient) {
                var total=0;
                
                total += $scope.details.results[$scope.selected][nutrient] 
                    * $scope.openModal.measure.weight;
            
            return total;
                
        
        }
        
        $scope.getUserIngredients = function(){
            
            if($scope.isAuth){
                searchService.getMyIngredients().then(function(response){
                    $scope.userIngredients = response;
                }, function(error){
                    console.log(error);
                });
            }else{
                // do something meaningful
                console.log("please login to continue");
            }
        }
        
        $scope.checkMyIngredients = function(ingredientId){
//            console.log(ingredientId);
            if($scope.isAuth){
                var result = false;
                for(var i=0; i<$scope.userIngredients.length; i++){
                    if ($scope.userIngredients[i].ingredient.id == ingredientId){
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
        $scope.getMyIngredients = function(id){
            if($scope.isAuth){
                var result = {};
                console.log($scope.userIngredients);
                for(var i=0; i<$scope.userIngredients.length; i++){
                    if ($scope.userIngredients[i].ingredient.id == id){
                        result = $scope.userIngredients[i];
                    }
                }
                return result;
            }else{
                //get user to login before continuing
                console.log("please login to continue");
            }
        }
        
        $scope.shortlistIngredient = function(ingredientId){
            if($scope.isAuth){
                if ($scope.checkMyIngredients(ingredientId)){
                    var myIngredientId = $scope.getMyIngredients(ingredientId);
                    searchService.removeFromMyIngredients(myIngredientId.id).then(
                        function(response){
                            $scope.getUserIngredients();
                    }, function(error){
                        console.log(error);
                    })
                }else{
                    searchService.shortlistIngredients(ingredientId).then(function(response){
                        $scope.getUserIngredients();
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