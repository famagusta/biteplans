'use strict';
// Controller to display search results on ingredients page

app.controller('ingredientsController', ['$scope', 'searchService',
    function($scope, searchService) {
        // function to search for ingredients 
        $scope.foodgroup=[];
        $scope.openModal ={};

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
    }
]);