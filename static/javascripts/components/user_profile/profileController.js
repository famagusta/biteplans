'use strict';

app.controller('profileController', ['$scope', 'AuthService',
    '$routeParams', 'constants', 'profileService',
    'searchService', '$location', 'recipeService',
    function($scope, AuthService, $routeParams, constants, profileService, 
              searchService, $location, recipeService) {
                            console.log("helloworld");

        AuthService.isAuthenticated()
            .then(function(response) {
                var isAuthenticated = response.status;
                
                if (isAuthenticated) {
                    $scope.tab = 2;
                    profileService.getProfile()
                    .then(function(response) {
                            //model for storing response from API
                        
                            /*convert height, weight to floats - find better way
                              to do this in future*/
                            response.weight = parseFloat(response.weight);
                            response.height = parseFloat(response.height);
                        
                            $scope.profileInfo = response; 
                            
                        }, function(error) {
                            console.log(error);
                        });
                    
                }
        });
    }]);