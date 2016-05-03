'use strict';
// Controller to display search results on ingredients page

app.controller('ingredientsController', ['$scope', 'searchService',
    function($scope, searchService) {
        // function to search for ingredients 
        $scope.foodgroup=[];

        $scope.search = function(page) {
            var query = $scope.query;
            console.log(query, page);
            if (query && $scope.foodgroup.length >0) {
                searchService.search_ingredient(query, page)
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
            else if (query && $scope.foodgroup.length ===0) {
                searchService.search_ingredient(query, page)
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

        };
        // function for modal when ingredient card is clicked
        $scope.openIngredientsModal = function(index) {
            $('#modal6').openModal();
            $scope.selected = index; // stores index of every card 
        };

        

    }
]);