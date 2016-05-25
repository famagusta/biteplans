'use strict';

app.factory('calendarService', ['httpService', 'AuthService', '$location',
    'constants', '$q', '$window', '$rootScope', '$auth',
    function(httpService, AuthService, $location,
        constants, $q, $window, $rootScope, $auth) {

        /* CRU(D) dietplans */
        // TODO: write function to delete a diet plan
        var getUserMonthEvents = function(dateString) {
            var url = '/user-calendar/follow/' + '?date=' + dateString;
            var deferred = $q.defer();
            httpService.httpGet(url)
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
            }
        };

    }
]);