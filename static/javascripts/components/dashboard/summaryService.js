'use strict';

app.factory('summaryService', ['httpService', 'AuthService', '$location',
    'constants', '$q', '$window', '$rootScope', '$auth',
    function(httpService, AuthService, $location,
        constants, $q, $window, $rootScope, $auth) {

        /* CRU(D) dietplans */
        // TODO: write function to delete a diet plan
        var getUserDayPlan = function(dateString) {
            var url = '/biteplans/calendar/getPlanSummary/' + '?date=' + dateString;
            var deferred = $q.defer();
            httpService.httpGet(url)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        var updateEventIngredient = function(obj, id) {
            var url = '/biteplans/calendar/dayPlanIngredient/' + id + '/';
            var deferred = $q.defer();
            httpService.httpPatch(url, obj)
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        return {
            getUserDayPlan: function(dateString) {
                return getUserDayPlan(dateString);
            },
            updateEventIngredient: function(obj, id){
                return updateEventIngredient(obj, id);
            }
        };

    }
]);