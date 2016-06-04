/* global app, $, console */

app.controller('profileController', ['$scope', 'AuthService',
    '$routeParams', 'constants', 'profileService',
    'searchService', '$location', 'recipeService',
    function($scope, AuthService, $routeParams, constants, profileService, 
              searchService, $location, recipeService) {
        'use strict';
        
        AuthService.isAuthenticated()
            .then(function(response) {
                var isAuthenticated = response.status;
                
                if (isAuthenticated) {
                    $scope.tab = 2;
                    $scope.inputImage = null;
                    $scope.profile_image_file = {};
                    $scope.profile_image_file.src="";
                    $scope.placeHolderDOB = new Date();
                    $scope.user_thum = "";
                    $scope.options = { year: 'numeric',
                                           month: 'long', 
                                           day: 'numeric' };
                    
                    
                    profileService.getProfile()
                    .then(function(response) {
                            //model for storing response from API
                        
                            /*convert height, weight to floats - find better way
                              to do this in future*/
                            response.weight = parseFloat(response.weight);
                            response.height = parseFloat(response.height);
                            response.body_fat_percent = 
                                parseFloat(response.body_fat_percent);
                            response.neck = parseFloat(response.neck);
                            response.shoulder = parseFloat(response.shoulder);
                            response.chest = parseFloat(response.chest);
                            response.forearm = parseFloat(response.forearm);
                            response.bicep = parseFloat(response.bicep);
                            response.waist = parseFloat(response.waist);
                            response.hip = parseFloat(response.hip);
                            response.thigh = parseFloat(response.thigh);
                            response.calf = parseFloat(response.calf);
                        
                            if (response.image_path){
                                $scope.user_thum = response.image_path;
                            }else if(response.social_thumb){
                                $scope.user_thum = response.social_thumb;
                            }else{
                                $scope.user_thum = 'static/images/default-user.png';
                            }
                            $scope.profileInfo = response; 
                            var dob = new Date($scope.profileInfo.date_of_birth);
                            

                            $scope.placeHolderDOB = dob.toLocaleDateString('en-GB',
                                                                           $scope.options);
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
                                // only if a date is selected will we change stuff
                                if(context.select){
                                    var date_to_set = new Date(context.select);

                                    $scope.placeHolderDOB = date_to_set.toLocaleDateString('en-GB',
                                                                               $scope.options);
                                    // plus 1 fixed the problem that date returns month in 0 to 11
                                    var dob_str = date_to_set.getFullYear() + '-' + (date_to_set.getMonth() + 1) + '-' + date_to_set.getDate();
                                    
                                    $scope.profileInfo.date_of_birth = dob_str;
                                }
                            }
                        });
                    };
                    
                    
                    $scope.uploadFile = function(id){
//                        var file = $scope.profile_image_file.src;
                        if($scope.cropper.croppedImage){
                            var image_blob = dataURLtoBlob($scope.cropper.croppedImage);
                            var fileName = 'profile_pic.' + $scope.fileExtn;
                            var file = new File([image_blob], fileName);
                            if(file){
                                profileService.uploadProfileImage(id, file);
                            }
                        }
                    };
                    
                    $scope.updateProfileInfo = function(){
                        $scope.uploadFile($scope.profileInfo.id);
                        var update_params = {
                            weight: $scope.profileInfo.weight || 0,
                            height: $scope.profileInfo.height || 0,
                            date_of_birth: $scope.profileInfo.date_of_birth || 0,
                            gender: $scope.profileInfo.gender || 0,
                            body_fat_percent: $scope.profileInfo.body_fat_percent || 0,
                            neck: $scope.profileInfo.neck || 0,
                            shoulder: $scope.profileInfo.shoulder || 0,
                            chest: $scope.profileInfo.chest || 0,
                            forearm: $scope.profileInfo.forearm || 0,
                            bicep: $scope.profileInfo.bicep || 0,
                            waist: $scope.profileInfo.waist || 0,
                            hip: $scope.profileInfo.hip || 0,
                            thigh: $scope.profileInfo.thigh || 0,
                            calf: $scope.profileInfo.calf || 0
                        };
                        profileService.updateProfile($scope.profileInfo.id,
                                                     update_params);
                    };
                }
     
            /* crop the required input file */
            $scope.cropper = {};
            $scope.cropper.sourceImage = null;
            $scope.cropper.croppedImage = null;
            $scope.fileSizeError = false;
            $scope.fileExtn = '';
            
            $scope.$watch('cropper.sourceImage', function(newVal, oldVal){
                if(newVal){
                    var file_size = dataURLtoBlob(newVal).size;
                    var image_blob = dataURLtoBlob(newVal);
                    $scope.fileExtn = (image_blob.type).split('/')[1];
                    
                    if (file_size > 5242880)
                    {
                        $scope.fileSizeError = true;
                        $scope.cropper.sourceImage = null;
                        $scope.cropper.croppedImage = null;
                    }
                    else
                    {
                        $scope.cropper.sourceImage = newVal;
                        $scope.fileSizeError = false;
                    }
                }
            });
            
            /* function that opens the upload image modal */
            $scope.uploadImageModal = function() {
                $('#upload-image-modal')
                    .openModal();
            };
            
            $scope.saveProfileImage = function(){
                if(!$scope.fileSizeError){
                    $scope.user_thum = $scope.cropper.croppedImage;
                }
                $('#upload-image-modal')
                    .closeModal();
            };

          });
        
    }]);