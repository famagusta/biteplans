'use strict';
// Controller to display search results on ingredients page

app.controller('ingredientsController', ['$scope', 'searchService', 'Data',
    function($scope, searchService, Data) {

        $scope.Data = Data;
        // function to search for ingredients 
        $scope.search = function() {
            var query = $scope.query;
            console.log(query);
            if (query) {
                searchService.search_ingredient(query)
                    .then(function(response) {
                        $scope.details = response; //model for storing response from API                
                        console.log($scope.details);
                    }, function(error) {
                        console.log(error);
                    });
            }

        };
        // function for modal when ingredient card is clicked
        $scope.openIngredientsModal = function(index) {
            $('#modal6')
                .openModal();
            $scope.selected = index; // stores index of every card 
        };

        // pagination
        $scope.currentPage = 1;
        $scope.pageSize = 100;

    }
]);