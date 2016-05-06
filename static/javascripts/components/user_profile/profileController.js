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
                    $scope.profile_image_file = {};
                    $scope.profile_image_file.src="";
                    $scope.placeHolderDOB = new Date();
                    
                    profileService.getProfile()
                    .then(function(response) {
                            //model for storing response from API
                        
                            /*convert height, weight to floats - find better way
                              to do this in future*/
                            response.weight = parseFloat(response.weight);
                            response.height = parseFloat(response.height);
                            
                            $scope.profileInfo = response; 
                            var dob = new Date($scope.profileInfo.date_of_birth);
                            var options = { year: 'numeric',
                                           month: 'long', 
                                           day: 'numeric' };

                            $scope.placeHolderDOB = dob.toLocaleDateString('en-GB',
                                                                           options);
                        }, function(error) {
                            console.log(error);
                        });
                    
                    $scope.updateDOB = function(){
                        
                        var $input = $('.datepicker_btn').pickadate({
                            format : 'd mmmm yyyy',
                            monthSelector: true,
                            yearSelector: true,
                            selectMonths: true,
                            selectYears: 100,
                            max: new Date(),
                            formatSubmit: false,
                            closeOnSelect: false,
                            onSet: function(context) {
                                //make api call to follow the plan on setting of date
                                /* convert to ISO 8601 date time string for serializer
                                  acceptance*/
                                var date_to_set = new Date(context.select);
                                $scope.placeHolderDOB = date_to_set;
                                var dob_str = date_to_set.getFullYear() + '-' 
                                    + date_to_set.getMonth() + '-' 
                                    + date_to_set.getDate();
                                $scope.profileInfo.date_of_birth = dob_str;
                            }
                        })
                    }
                    
                    
                    $scope.uploadFile = function(id){
                        var file = $scope.profile_image_file.src;
                        if(file){
                            profileService.uploadProfileImage(id, file);
                        }
                    };
                    
                    $scope.updateProfileInfo = function(){
                        $scope.uploadFile($scope.profileInfo.id);
                        var update_params = {
                            weight: $scope.profileInfo.weight,
                            height: $scope.profileInfo.height,
                            date_of_birth: $scope.profileInfo.date_of_birth,
                            gender: $scope.profileInfo.gender
                        }
                        profileService.updateProfile($scope.profileInfo.id,
                                                     update_params);
                    }
                }
        });
    }]);