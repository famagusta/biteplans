'use strict';
app.controller('dashboardController', ['$scope', '$window', '$location',
    'AuthService', 'searchService', 'profileService',
    function($scope, $window, $location, AuthService, searchService,
        profileService) {
        var isAuth = false;
        
        AuthService.isAuthenticated()
            .then(function(response){
                isAuth = response.status;
                if(isAuth){
                    $scope.token = $window.localStorage.token;
                    $scope.username = $window.localStorage.username;
                    $scope.tab = {}
                    $scope.tab.tab = 1;

                    $scope.setTab = function(tabId) {
                        $scope.tab.tab = tabId;
                    };

                    $scope.isSet = function(tabId) {
                        return $scope.tab.tab === tabId;
                    };
                    
                     $scope.openShortInfoModal = function() {
                        $('#small-modal').openModal();
                    }
                   

                    $scope.edit = 0;

                    $scope.editProfileForm = function() {
                        $scope.edit = 1;
                    }

                    $scope.calendar = function(){
                        $scope.tab.tab = 3;
                    }
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
                        $scope.content = response['success'];
                        $window.localStorage.token = response[
                            'token'];
                        $location.path('/dashboard');
                    }
                    else
                        console.log(response);
                }, function(error) {
                    $scope.content = error;
                });
        };
        init();
    }
]);