/* global app, $ */


app.controller('navbarController', ['$scope', '$location', 'AuthService',
    'profileService', '$rootScope', 'constants', '$window', 'searchService',
    'planService', '$routeParams',
    function($scope, $location, AuthService, profileService, $rootScope, constants, $window,
            searchService, planService, $routeParams) {
        'use strict';
        // function to check whether the person is logged in or not
        var currPath = $location.path()
        var locationRegex = new RegExp('/dashboard/*')
        $scope.isDashboard = locationRegex.test(currPath);
        console.log($scope.isDashboard);
        $scope.isLoggedIn = false;
        $scope.profileInfo = {};
        $scope.placeHolderDOB = null;
        var isProfileInfo = false;
        
        var checkLoggedIn = function() {
            AuthService.isAuthenticated()
                .then(function(response) {
                    $scope.isLoggedIn = response.status;
                    $scope.profileInfo.id = response.pk;
                    isProfileInfo = response.profile_status;
                    getProfileInfo();
                
                    //prompt user to fill in basic details
                    if(response.status && !isProfileInfo){
                        openUserInfoModal();    
                    };
                }, function(error) {
                    $scope.isLoggedIn = false;
                });
            return $scope.isLoggedIn;
        };
        checkLoggedIn();
        
        $rootScope.$on('authFailure', function(event, args) {
            /* function to access navbar controller for auth */
            $scope.openModal();
        });
        
        var getProfileInfo = function(){
            profileService.getProfile()
                .then(function(response) {
                    if (response.image_path) {
                        $scope.user_thum = response.image_path;
                    }
                    else if (response.social_thumb) {
                        $scope.user_thum = response.social_thumb;
                    }
                    else {
                        $scope.user_thum =
                            'static/images/default-user.png';
                    }
                }, function(error) {
                    console.log(error);
            });
        };
        //by default first modal viw will be visible;
        $scope.modal1 = true;
        $scope.modal2 = false;
        $scope.modal3 = false;
        $scope.modal4 = false;


        //login object taken up from login from, ill be used to make login post request
        $scope.login = {};
        //signup object taken up from signup from, ill be used to make signup post request

        $scope.signup = {};

        $scope.forgot = {};

        //Function to switch the views within modal;
        $scope.switchToModal = function(number) {
            // function to change the content in modal window

            //show second modal view

            if (number === 2 && $scope.modal2 !== true) {
                $scope.modal2 = true;
                $scope.modal1 = false;
                $scope.modal3 = false;
                $scope.modal3 = false;

            }

            //show third modal view  
            else if (number === 3 && $scope.modal3 !== true) {
                $scope.modal3 = true;
                $scope.modal1 = false;
                $scope.modal2 = false;
                $scope.modal4 = false;

            }

            //show fourth modal view  
            else if (number === 4 && $scope.modal4 !== true) {
                $scope.modal3 = false;
                $scope.modal1 = false;
                $scope.modal2 = false;
                $scope.modal4 = true;

            }
            //show default that is first modal view    
            else {
                $scope.modal1 = true;
                $scope.modal2 = false;
                $scope.modal3 = false;
                $scope.modal4 = false;
            }
        };
        //Function to open the modal on clicking login button in the nav
        $scope.openModal = function() {
            $('#modal1')
                .openModal();
            $scope.modal1 = true;
            $scope.modal2 = false;
            $scope.modal3 = false;
            $scope.modal4 = false;
        };
        //function to signup manually
        $scope.register = function() {
            //these vars are the required params
            var username = $scope.signup.username;
            var password = $scope.signup.registerPassword;
            var confirm = $scope.signup.confirmPassword;
            var email = $scope.signup.email;

            if (username && password && confirm && email) {
                AuthService.register(username, password, confirm,
                        email)
                    .then(
                        function(response) {
                            $scope.registerSuccess = response.success +
                                "Please check your email account to activate your profile";
                        },
                        function(error) {
                                      console.log(error);
                            $scope.registerError = error.message;
                        }
                    );
            }
            else {
                $scope.registerError = 'Fields are missing';
            }
        };
        
        /*function to login using manual details. 
        email is the required field and is taken as username */
        $scope.login = function() {
            //these are required params
            var username = $scope.login.username;
            var password = $scope.login.password;


            if (username && password) {
                AuthService.login(username, password)
                    .then(
                        function(response) {
                            $scope.isLoggedIn = true;
                            $('#modal1')
                                .closeModal();
                            checkLoggedIn();
                            $route.reload();
                        },
                        function(error) {
                            $scope.loginError =
                                'Invalid Credentials! Are you sure you did not sign-up using Google or Facebook?';
                        }
                    );
            }
            else {
                $scope.loginError =
                    'Username and Password required';
            }
        };

        // function to logout 
        $scope.logout = function() {
            var response = AuthService.logout();
            if (response) {
                $scope.isLoggedIn = false;
                $window.location.assign('/');
            }
        };

        $scope.Auth = function(provider) {
            //provider can be facebook, google-oauth2
            AuthService.socialAuth(provider)
                .then(function(response) {
                    $scope.isLoggedIn = true;
                    checkLoggedIn();
                    //close the modal if login is success
                    $('#modal1').closeModal();
                    $route.reload();
                }, function(error) {
                    //there is an error
                    $scope.loginError = error;
                    $location.path('/');
                });

        };


        $scope.closeModal = function() {
            $('#modal1').closeModal();
        };

        /*function to reset password, calls auth service to call 
        forgot password feature. Email is a param */
        $scope.resetPassword = function() {

            var email = $scope.forgot.email;
            AuthService.forgotPassword(email)
                .then(function(response) {
                        //message on success
                        $scope.Message =
                            'Please check your email to reset password';
                    },
                    function(response) {
                        //message on error
                        $scope.Message =
                            'Something went wrong, try again later';
                    });

        };
        
        $scope.load = function(path){
            $window.location.assign(path);  
        };
        
        $rootScope.$on('getAdditionalUserInfo', function(event, args) {
            /* function to access navbar controller for auth */
            openUserInfoModal();
            getProfileInfo();
        });
        
        var openUserInfoModal = function(){
            $scope.modal1 = false;
            $scope.modal2 = false;
            $scope.modal3 = true;
            $scope.modal4 = false;
            $('#user_info_modal').openModal();  
        };
        
        $scope.activityLevelChoices = ['Sedentary', 'Mild Activity',
                                       'Moderate Activity','Heavy Activity',
                                       'Very Heavy Activity'];
        var activityLevelChoicesDict = {
            'Sedentary': 'S',
            'Mild Activity': 'MA',
            'Moderate Activity': 'OA',
            'Heavy Activity': 'HA',
            'Very Heavy Activity': 'VHA'
        };
        
        $scope.profileInfo.activity_level = $scope.activityLevelChoices[0];
        
        $scope.updateDOB = function(){
            var $input = $('#dob_field_nav').pickadate({
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

                        $scope.placeHolderDOB = date_to_set.toLocaleDateString('en-GB',$scope.options);
                        // plus 1 fixed the problem that date returns month in 0 to 11
                        var dob_str = date_to_set.getFullYear() + '-' + (date_to_set.getMonth() + 1) + '-' + date_to_set.getDate();

                        $scope.profileInfo.date_of_birth = dob_str;
                    }
                }
            });
        };

                    
        $scope.updateProfileInfo = function(){
            var update_params = {
                weight: $scope.profileInfo.weight || 0,
                height: $scope.profileInfo.height || 0,
                date_of_birth: $scope.profileInfo.date_of_birth || 0,
                activity_level: activityLevelChoicesDict[$scope.profileInfo.activity_level] || 0,
                gender: $scope.profileInfo.gender || 0
            };
            $('#user_info_modal').closeModal(); 
            profileService.updateProfile($scope.profileInfo.id,
                                         update_params);
        };
        
        $('.button-collapse-1').sideNav({
          menuWidth: 300, // Default is 240
          closeOnClick: true, 
            edge:'left'
        // Closes side-nav on <a> clicks, useful for Angular/Meteor

        });
        var isAuth = false;
        
        AuthService.isAuthenticated()
            .then(function(response){
                isAuth = response.status;
                if(isAuth){
                    $scope.token = $window.localStorage.token;
                    $scope.username = $window.localStorage.username;
                    $scope.params = $routeParams;
                    
                    $scope.tab = {};
                    var dashboardItems = ['summary', 'profile', 'calendar', 'plans', 'recipes', 'ingredients'];
                    
                    if (dashboardItems.indexOf($scope.params.page) > -1) {
                        
                        $scope.tab.tab = $scope.params.page;
                    } 
                    else {
                        $scope.tab.tab = 'summary';
                    }
                    
                    $scope.setTab = function(tab) {
                        $('.button-collapse-2').sideNav('hide');
                        if (dashboardItems.indexOf(tab) > -1){
                            $location.path('dashboard/' + tab);
                        } else if (tab === "searchPlans") {
                            $window.location.assign('dietplans/search');
                        } else if(tab === "createRecipe"){
                            $window.location.assign('recipes/create-recipes');
                        }
                        else {
                            $location.path('dashboard/summary');
                        }
                    };
                    

                    $scope.tab.isSet = function(tabId) {
                        return $scope.tab.tab === tabId;
                    };
                    
//                    $scope.openCreatePlanModal = function() {
//                        console.log('opening modal');
//                        $('#create-plan-nav-modal').openModal();
//                    };
//                   
//                    $scope.createPlan = function()
//                    {
//                        if(constants.userOb.status)
//                        planService.createPlan($scope.plan).then(function(
//                            response)
//                        {
//                            
//                            $window.location.assign('/dietplans/create/overview/' + response.dietplan_id);
//                            $('#create-plan-nav-modal').closeModal();
//                            
//                        }, function(error)
//                        {
//                            console.log(error);
//                        });
//                    };
                    
                    $scope.isMobile = function(){
                        /* dynamically add navbar-fixed class to navbar for mobile devices - we want the navbar to be fixed on phones but
                        not browser*/
                        return $window.innerWidth < 600;
                    }

                    $scope.edit = 0;

                    $scope.editProfileForm = function() {
                        $scope.edit = 1;
                    };

                    $scope.calendar = function(){
                        $scope.tab.tab = 'calendar';
                    };
                    
                }else{
                    console.log('oops');
                    $location.path("/");
                }
        }, function(error){
            console.log(error);
        });

        $scope.openCreatePlanModal = function() {
            console.log('opening modal');
            if(constants.userOb.status){
                $('#create-plan-nav-modal').openModal();
            }else{
                $scope.openModal();
            }
            
        };
        
        $scope.createPlan = function(){
            if(constants.userOb.status){
            planService.createPlan($scope.plan)
                .then(function(response){
                    $window.location.assign('/dietplans/create/overview/' + response.dietplan_id);
                    $('#create-plan-nav-modal').closeModal();

                }, function(error)
                {
                    console.log(error);
                });
            }
        };
        
    }
]);

app.controller("landingPageController", ['$scope', '$window', function($scope, $window){
    $scope.getBanner = function(){
        $scope.banner = '';
            if($window.innerWidth > 600){
                $scope.banner = "static/images/banner_bg.jpg"
            }else{
                $scope.banner = "static/images/mobile_bg.jpg"
            }
        };
    $scope.getBanner();
}]);