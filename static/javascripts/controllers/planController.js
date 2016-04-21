'use strict';
app.controller('planController', ['$scope','AuthService', 'ingredientService', '$location', 'planService', function($scope, AuthService, ingredientService, $location, planService) {
    
    $scope.openShortInfoModal = function () {
        $('#small-modal').openModal();
    }
    
     $scope.createPlan = function () {

        

        planService.createPlan($scope.plan).then(function(response){
            console.log(response);
            $location.path('/plan/'+response.dietplan_id);
            $('#small-modal').closeModal();

        }, function(error){
            console.log(error);
        });

    };
}]);
