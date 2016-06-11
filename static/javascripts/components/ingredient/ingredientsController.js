/* global app, $, console */
// Controller to display search results on ingredients page

app.controller('ingredientsController', 
               ['$scope', 'searchService', 'AuthService', '$rootScope',
                'constants','$routeParams', '$location',
    function($scope, searchService, AuthService, $rootScope, constants, $routeParams, $location) {
        'use strict';
        
        
        //extract query parameters
        var params = $routeParams;
        
        $scope.query = params.query ? params.query : '';
        $scope.sortby = params.sortby ? params.sortby : '';
        $scope.page = params.page? parseInt(params.page) : 1;
        $scope.foodgroup = params.filters? params.filters.split('-') :  [];
        
        // function to search for ingredients 
        //$scope.foodgroup=[];

        // stores index of selected card
        $scope.selected = 0;
        $scope.ingredientSelected = {};
        
        
        // stores ingredients user has previously liked
        $scope.userIngredients = [];
                
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
            $scope.search();
        };
        
        $scope.updatePaginate = function(val){
            $scope.page = val;
            $scope.search();
        }
        
        $scope.searchService = searchService;

        $scope.$watchCollection('foodgroup', function (newVal, oldVal) {
            $scope.search();
         });

        $scope.search = function() {
            if($scope.query !== undefined){
                $scope.details = null;

            var sortby = $scope.sortby;
            var page = $scope.page;
            var query = $scope.query;
            var foodgroup = $scope.foodgroup;

            $location.search('query', query); 
            $location.search('page', page);
            $location.search('filters', foodgroup.join('-'));
            $location.search('sortby', sortby);
                
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
        
        if($scope.query){
            $scope.search($scope.page);
        }
        
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
                
            });
             
        };
           

        $scope.calculateIngredientInfo = function(nutrient, isAdditional) {
            var total=0;
            if($scope.details.results  !== null){
                if(isAdditional){
                    total += $scope.details.results[$scope.selected]
                    	.additionalIngredientInfo[nutrient] * $scope.ingredientSelected.selectedMeasure
                    	.weight/100;
                }
                else{
                    total += $scope.details
                    	.results[$scope.selected][nutrient] * $scope.ingredientSelected.selectedMeasure
                    	.weight/100;
                }
            }
            return total;
                
        
        };
        
        $scope.getUserIngredients = function(){
            /* get user saved ingredients if logged in*/
            if(constants.userOb.status){
                searchService.getMyIngredients().then(function(response){
                    $scope.userIngredients = response.results;
                }, function(error){
                    console.log(error);
                });
            }
        };
        
        $scope.checkMyIngredients = function(ingredientId){
            /* check if given ingredient has been saved by user */
            if(constants.userOb.status){
                var result = false;
                for(var i=0; i<$scope.userIngredients.length; i++){
                    if ($scope.userIngredients[i].ingredient.id == ingredientId){
                        result = true;
                    }
                }
                return result;
            }
        };
        
        /* get object corresponding to given ingredient in my ingredients */
        $scope.getMyIngredients = function(id){
            if(constants.userOb.status){
                var result = {};
                for(var i=0; i<$scope.userIngredients.length; i++){
                    if ($scope.userIngredients[i].ingredient.id == id){
                        result = $scope.userIngredients[i];
                    }
                }
                return result;
            }
        };
        
        $scope.shortlistIngredient = function(ingredientId){
            if(constants.userOb.status){
                if ($scope.checkMyIngredients(ingredientId)){
                    var myIngredientId = $scope.getMyIngredients(ingredientId);
                    searchService.removeFromMyIngredients(myIngredientId.id).then(
                        function(response){
                            $scope.getUserIngredients();
                    }, function(error){
                        console.log(error);
                    });
                }else{
                    searchService.shortlistIngredients(ingredientId).then(function(response){
                        $scope.getUserIngredients();
                    }, function(error){
                        console.log(error);
                    });
                }
            }else{
                /* prompt user for login */
                $rootScope.$emit('authFailure');
            }
        };
        
        $scope.getFilterLabel = function(filter){
            var filterNames ={
                'carbohydrate_tot': "Carbohydrates",
                'protein_tot': "Proteins",
                'fat_tot': "Fats",
                'energy_kcal': "Calories",
                'sugar_tot': "Sugar",
                'fiber_tot': "Fiber",
                'water': "Water"
            };
            return filterNames[filter];
        };
        
        if(constants.userOb.status){
            $scope.getUserIngredients();
        }
    }
]);