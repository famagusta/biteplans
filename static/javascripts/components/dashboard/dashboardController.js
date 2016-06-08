/* global app, $, console */

app.controller('dashboardController', ['$scope', '$window', '$location',
    'AuthService', 'searchService', 'profileService', 'constants', 'planService', '$routeParams',
    function($scope, $window, $location, AuthService, searchService,
        profileService, constants, planService, $routeParams) {
        'use strict';
        
        var isAuth = false;
        
        AuthService.isAuthenticated()
            .then(function(response){
                isAuth = response.status;
                if(isAuth){
                    $scope.token = $window.localStorage.token;
                    $scope.username = $window.localStorage.username;
                    $scope.params = $routeParams;
                    
                    $scope.tab = {};
                    var dashboardItems = ['summary', 'profile', 'calendar', 'myplans', 'myrecipes', 'myingredients'];
                    
                    if ($scope.params.page in dashboardItems) {
                        $scope.tab.tab = $scope.params.page
                    } else {
                        $scope.tab.tab = 'summary';
                    }
                    
                    $scope.setTab = function(tab) {
                        $scope.tab.tab = tab;
                        if (tab in dashboardItems){
                            $location.path('dashboard/' + tab);
                        } else if (tab === "searchPlans") {
                            $window.location.assign('dietplans/search');
                        }else {
                            $location.path('dashboard/summary');
                        }
                    };
                    

                    $scope.isSet = function(tabId) {
                        return $scope.tab.tab === tabId;
                    };
                    
                     $scope.openShortInfoModal = function() {
                        $('#create-plan-dash-modal').openModal();
                    };
                   
                    $scope.createPlan = function()
                    {
                        if(constants.userOb.status)
                        planService.createPlan($scope.plan).then(function(
                            response)
                        {
                            
                            $location.path('/dietplans/create/overview/' + response.dietplan_id);
                            $('#create-plan-dash-modal').closeModal();
                            
                        }, function(error)
                        {
                            console.log(error);
                        });
                    };
                    
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
                        $scope.tab.tab = 3;
                    };
                }else{
                    $location.path("/");
                }
        }, function(error){
            console.log(error);
        });
        
    }
]);


app.controller('confirmController', ['$scope', '$window', '$location',
    'httpService', '$routeParams',
    function($scope, $window, $location, httpService, $routeParams) {
        $scope.content = 'Just a moment we are confirming your account';
        var init = function() {
            var activation_key = $routeParams.activation_key;
            var url = '/authentication/registerConfirm/' +
                activation_key + '/';
            httpService.httpGet(url)
                .then(function(response) {
                    if (response.success) {
                        $scope.content = response.success;
                        $window.localStorage.token = response.token;
                        $location.path('/dashboard');
                    }
                }, function(error) {
                    $scope.content = error;
                });
        };
        init();
    }
]);