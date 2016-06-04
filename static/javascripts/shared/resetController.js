'use strict';
/* global app*/

app.controller('resetController', ['$scope', '$window', '$location','httpService','$routeParams',
               function ($scope, $window, $location, httpService, $routeParams){ 
                $scope.password = '';
                $scope.confirmP = '';
                $scope.init = function(){
                  var activation_key = $routeParams.activation_key;
                  var uid = $routeParams.uid;
                  var url = 'authentication/forgot/password/reset/confirm/';
                  httpService.httpPost(url, {
                    'uid' : uid,
                    'token' : activation_key,
                    'new_password' : $scope.password,
                    're_new_password' : $scope.confirmP,
                  }).then( function(response){
                    $scope.success = 'Password has been reset, please login';
                },function(response){
                  $scope.content = response.data;
                });
                }; 
               }]);