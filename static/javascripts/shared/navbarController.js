/* global app, $ */


app.controller('navbarController', ['$scope', '$location', 'AuthService',
    'profileService', '$rootScope', 'constants', '$window', 'searchService',
    'planService', '$routeParams', '$route',
    function($scope, $location, AuthService, profileService, $rootScope, constants, $window,
            searchService, planService, $routeParams, $route) {
        'use strict';
        // function to check whether the person is logged in or not

        $scope.isLoggedIn = false;
        $scope.profileInfo = {};
        $scope.placeHolderDOB = null;
        var isProfileInfo = false;
        $scope.tab = {};
        
        var updateNavbarIcons = function(){
            var params = $routeParams;
            
            var dashboardItems = ['summary', 'profile', 'calendar', 'plans', 'recipes', 'ingredients'];

            if (dashboardItems.indexOf(params.page) > -1) {
                $scope.tab.tab = params.page;
            } 
            else {
                $scope.tab.tab = 'summary';
            }
        }
        
        $scope.$on('$routeChangeStart', function(next, current) {
            $scope.tab.tab = current.params.page;
        });
        
        var checkLoggedIn = function() {
            AuthService.isAuthenticated()
                .then(function(response) {
                    $scope.isLoggedIn = response.status;
                    $scope.profileInfo.id = response.pk;
                    isProfileInfo = response.profile_status;
                    getProfileInfo();
                    updateNavbarIcons();
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
        
        $scope.activityDescriptions = {
            'Sedentary': 'Little or no Exercise/ desk job',
            'Mild Activity': 'Light exercise/ sports 1 – 3 days/ week',
            'Moderate Activity': 'Moderate Exercise, sports 3 – 5 days/ week',
            'Heavy Activity': 'Heavy Exercise/ sports 6 – 7 days/ week',
            'Very Heavy Activity': 'Very heavy exercise/ physical job/ training 2 x/ day'
        };
        
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
        
        $scope.activityDesc = 
            $scope.activityDescriptions[$scope.profileInfo.activity_level];
        $scope.updateDOB = function(){
            var $input = $('#dob_field_nav').pickadate({
                format : 'd mmmm yyyy',
                monthSelector: true,
                yearSelector: true,
                selectMonths: true,
                selectYears: 100,
                today: 'Today',
                clear: '',
                close: 'Done',
                onRender: function(){
                    /* Restyle the date picker for better UI UX*/
                    var noOfPickers = $('.picker__month-display').length;

                    for (var i=0; i< noOfPickers; i++){
                        $('.picker__month-display')[i].innerHTML = "";
                        $('.picker__day-display')[i].innerHTML = "";
                        $('.picker__weekday-display')[i].innerHTML = "";
                        $('.picker__year-display')[i].innerHTML = "";

                        $('.picker__weekday-display')[i].innerHTML = "Date of Birth";
                        $('.picker__month-display')[i].innerHTML = "Select Your Date of Birth";
                    }
                }, 
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
        
        $scope.goToCreateRecipe = function(){
            if(constants.userOb.status){
                $location.path("/recipes/create-recipes");
            }else{
                $scope.openModal();
            }    
        };

        $scope.goToDashboard = function(){
            if(constants.userOb.status){
                $location.path("/dashboard");
            }else{
                $scope.openModal();
            }    
        };
        
        $scope.openCreatePlanModal = function() {
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

app.controller("landingPageController", ['$scope', '$window', 'constants', function($scope, $window, constants){
    $scope.isLoggedIn = constants.userOb.status;
    
    // handle weird margin issues with the parallax container
    $scope.marginForLoggedIn = '0px;';
    if($scope.isLoggedIn){
        $scope.marginForLoggedIn = "-19px !important;";
    }
    
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