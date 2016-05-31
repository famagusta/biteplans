'use strict';
// Controller to display search results on ingredients page

app.controller('ingredientsController', ['$scope', 'searchService', 'AuthService',
    function($scope, searchService, AuthService) {
        // function to search for ingredients 
        $scope.foodgroup=[];

        // stores index of selected card
        $scope.selected = 0;
        $scope.ingredientSelected = {};
        
        $scope.isAuth = '';
        
        // stores ingredients user has previously liked
        $scope.userIngredients = [];
        
        AuthService.isAuthenticated()
            .then(function(response) {
                $scope.isAuth = response.status;
                $scope.getUserIngredients();
            }, function(error){
            console.log(error);
        });
        
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
        
        $scope.searchService = searchService;

        $scope.$watchCollection('foodgroup', function (newVal, oldVal) {
            $scope.search(1, $scope.sortby);
         });

        $scope.search = function(page, sortby) {
            if($scope.query !== undefined){
                $scope.details = null;

            $scope.sortby = sortby
            
            var query = $scope.query;
            if (query!== undefined && $scope.foodgroup.length >0) {
                searchService.search_ingredient(query, page, $scope.foodgroup, sortby)
                    .then(function(response) {
                        //model for storing response from API
                        $scope.details = response;
                        $scope.filts = response.filters; 
                        
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
                        //model for storing response from API
                        $scope.details = response;
                        $scope.filts = response.filters;                 
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
                        // pagination
                        $scope.currentPage = page;
                        $scope.pageSize = response.total*6;
                    }, function(error) {
                        console.log(error);
                    });
            }

        }};
        
        // function for modal when ingredient card is clicked
        $scope.openIngredientsModal = function(detail) {
//            $scope.selected = 0;
            $scope.ingredientSelected = {};
            

            var ingredientMatch = $scope.details.results.filter(
                function(el)
                {
                    return el.id === detail.id;
            });
            var index = findWithAttr($scope.details.results,
                'id', ingredientMatch[0].id);
            
            $scope.selected = index;
            $scope.details.results[$scope.selected].additionalIngredientInfo = {};
            searchService.get_ingredient_addtnl_info($scope.details
                                                     .results[$scope.selected].id)
                .then(function(response){
                    $scope.details.results[$scope.selected].additionalIngredientInfo =
                        response;
                    
                    // modal must only initialize after additionalingredient info is retrieved
                    $scope.ingredientSelected = $scope.details.results[$scope.selected];
                    $scope.ingredientSelected.selectedMeasure =
                        $scope.ingredientSelected.measure[0];
                    $('#modal6').openModal();
                }, function(error){
                
            })
             
        };
           

        $scope.calculateIngredientInfo = function(nutrient, isAdditional) {
            var total=0;
            if($scope.details.results  !== null){
                if(isAdditional){
                    total += $scope.details.results[$scope.selected].additionalIngredientInfo[nutrient] 
                    * $scope.ingredientSelected.selectedMeasure.weight/100;
                }
                else{
                    total += $scope.details.results[$scope.selected][nutrient] 
                        * $scope.ingredientSelected.selectedMeasure.weight/100;
                }
            }
            return total;
                
        
        }
        
        $scope.getUserIngredients = function(){
            
            if($scope.isAuth){
                searchService.getMyIngredients().then(function(response){
                    $scope.userIngredients = response.results;
                }, function(error){
                    console.log(error);
                });
            }else{
                // do something meaningful
                console.log("please login to continue");
            }
        }
        
        $scope.checkMyIngredients = function(ingredientId){
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