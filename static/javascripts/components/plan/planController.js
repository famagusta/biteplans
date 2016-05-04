'use strict';
app.controller('planController', ['$scope', 'AuthService', 'searchService',
    '$location', 'planService',
    function($scope, AuthService, searchService, $location,
        planService) {
        
        $scope.query_plan = '';
        $scope.plans = {};
        
        $scope.search_plan = function() {
            var query = $scope.query_plan;
            if (query) {
                searchService.search_plan(query)
                    .then(function(response) {
                        $scope.plans = response;
                    }, function(error) {
                        console.log(error);
                    });
            }
        };
        
        $scope.openShortInfoModal = function() {
            $('#small-modal')
                .openModal();
        }

        $scope.createPlan = function() {

            planService.createPlan($scope.plan)
                .then(function(response) {
                    console.log(response);
                    $location.path('/plan/' + response.dietplan_id);
                    $('#small-modal')
                        .closeModal();

                }, function(error) {
                    console.log(error);
                })
        };
        
          $scope.selectedDate = null;
        
        $scope.followPlan = function(){
            console.log($scope.selectedDate);
        }
    }
]);