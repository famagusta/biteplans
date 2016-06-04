
/* global app */

app.factory('calendarService', ['httpService', 'AuthService', '$location',
    'constants', '$q', '$window', '$rootScope', '$auth',
    function(httpService, AuthService, $location,
        constants, $q, $window, $rootScope, $auth) {
        'use strict';

        /* CRU(D) dietplans */
        // TODO: write function to delete a diet plan
        var getUserMonthEvents = function(dateString) {
            var url = '/dashboard/follow/' + '?month=' + dateString;
            var deferred = $q.defer();
            httpService.httpGet(url)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };
        
        var unfollowPlan = function(id) {
            var url = '/dashboard/follow/' + id + '/';
            var deferred = $q.defer();
            httpService.httpDelete(url)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        return {
            getUserMonthEvents: function(dateString) {
                return getUserMonthEvents(dateString);
            },
            unfollowPlan: function(id){
                return unfollowPlan(id);
            }
        };

    }
]);