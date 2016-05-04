'use strict';

app.controller('profileController', ['$scope', 'AuthService',
    '$routeParams', 'constants', 'profileService',
    'searchService', '$location', 'recipeService',
    function($scope, AuthService, $routeParams, constants, profileService, 
              searchService, $location, recipeService) {

        AuthService.isAuthenticated()
            .then(function(response) {
                var isAuthenticated = response.status;
                
                if (isAuthenticated) {
                    $scope.tab = 2;
                    $scope.profileInfo = {};
                    profileService.getProfile()
                    .then(function(response) {
                            //model for storing response from API
                        
                            /*convert height, weight to floats - find better way
                              to do this in future*/
                            $scope.profileInfo.weight = parseFloat(response.weight);
                            $scope.profileInfo.height = parseFloat(response.height);
                            $scope.profileInfo.id = response.id;

                        
//                            $scope.profileInfo = response; 
                        }, function(error) {
                                    console.log(error);
                                });
                           
                              $scope.updateDetailsInDashboard = function() {
//                                    var detailObj = {
//                                        'weight': $scope.profileInfo.weight,
//                                        'height': $scope.profileInfo.height,
//                                        'id' : $scope.profileInfo.id
//                                    };

                                  console.log($scope.profileInfo);
                            profileService.updateSavedPlan($scope.profileInfo, $scope.profileInfo.id)
                                .then(function(response) {
                                    console.log(response);
                                }, function(error) {
                                    console.log(error);
                                });
                        };

                    
                    
                    
     
    }
        });
        
    }]);