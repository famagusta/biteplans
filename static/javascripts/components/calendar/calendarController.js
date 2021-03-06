
/* global app, moment, console*/

// controller for the calendar. accessed by dashboard.html
app.config(['$mdThemingProvider', function($mdThemingProvider)
{
    $mdThemingProvider.theme("default")
        .primaryPalette("cyan")
        .accentPalette("light-green");
}]);
app.controller("calendarCtrl", ['$scope', '$filter', '$q', '$timeout', '$log',
                                'httpService', 'AuthService', '$location', 'MaterialCalendarData', 'calendarService',
                                function($scope, $filter, $q, $timeout, $log, httpService, AuthService, $location, MaterialCalendarData,
        calendarService)
    {
        'use strict';
        
        $scope.selectedDate = moment().format('YYYY-MM-DD');
        $scope.currentUserPlans = [];
        
        $scope.weekStartsOn = 0;
        $scope.dayFormat = "d";
        $scope.tooltips = true;
        $scope.disableFutureDates = false;
        $scope.setDirection = function(direction)
        {
            $scope.direction = direction;
            $scope.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
        };
        $scope.dayClick = function(date)
        {
//            $scope.setTab('summary');
            $location.search('date', null)
            var dateClick = $filter("date")(date, "y-MM-d");
            $location.path('/dashboard/summary').search('date', dateClick);
        };
        $scope.prevMonth = function(data)
        {
            $scope.selectedDate = data.year + '-' + data.month + '-' + '01';
            $scope.getUserFollowingPlans($scope.selectedDate);

        };
        $scope.nextMonth = function(data)
        {
            $scope.selectedDate = data.year + '-' + data.month + '-' + '01';
            $scope.getUserFollowingPlans($scope.selectedDate);
        };
        $scope.setContentViaService = function()
        {
            var today = new Date();
            MaterialCalendarData.setDayContent(today, '<span> :oD </span>');
        };
        $scope.getDietCalendarTitle = function(inputKey, timetable)
        {
            var key = moment(inputKey);
            
            /* check all dietplans to see if any of them fall on a this particular day */
            for (var i = 0; i < timetable.length; i++)
            {
                /* declare start and end date of a given diet plan */
                var start_date = moment(timetable[i].start_date);
                var end_date = moment(timetable[i].start_date)
                    .add(timetable[i].dietplan.duration, "w");
                /* check if given key date is between start and end date of any dietplan */
                if (key.isSameOrAfter(start_date) && key.isBefore(end_date))
                {
                    
                    return timetable[i].dietplan.name;
                }
            }
        };
        $scope.currMonthPromise = null;
        $scope.currMonthContext = null;
        /* This function sets the contents of a day and is called asynchronously*/
        $scope.setDayContent = function(date)
        {
            var key = moment(date)
                .format('YYYY-MM-DD');
            if ($scope.currMonthContext !== moment(date)
                .month())
            {
                $scope.currMonthContext = moment(date)
                    .month();
                var deferred = $q.defer();
                var url = '/dashboard/follow/' + '?date=' + key;
                /* get request for getting the dietplans a user is following in a month */
                httpService.httpGet(url)
                    .then(function(response)
                    {
                        deferred.resolve(response);
                    }, function(error)
                    {
                        deferred.reject(error);
                    });
                /* chained promises to get the correct text represnetation of the 
            date */
                var promiseB = deferred.promise.then(function(result)
                {
                    return $scope.getDietCalendarTitle(key, result);
                });
                $scope.currMonthPromise = deferred;
                return promiseB;
            }
            else
            {
                var promiseC = $scope.currMonthPromise.promise.then(function(result)
                {
                    return $scope.getDietCalendarTitle(key, result);
                });
                return promiseC;
            }
        };
        
        $scope.getUserFollowingPlans = function(dateString){
            calendarService.getUserMonthEvents(dateString).then(function(response){
                $scope.currentUserPlans = response;
                for(var i=0; i<$scope.currentUserPlans.length; i++){
                    var duration = $scope.currentUserPlans[i].dietplan.duration*7 - 1;
                    var end_date = moment($scope.currentUserPlans[i].start_date).add(duration,'days');
                    var start_date = moment($scope.currentUserPlans[i].start_date);
                    $scope.currentUserPlans[i].end_date = end_date.format('DD MMM YYYY');
                    $scope.currentUserPlans[i].start_date = start_date.format('DD MMM YYYY');
                }
            }, function(error){
                console.log(error);
            });
        };
        
        $scope.getUserFollowingPlans($scope.selectedDate);
        
        $scope.unfollow = function(id){
            calendarService.unfollowPlan(id).then(function(response){
                $scope.getUserFollowingPlans($scope.selectedDate);
                $scope.setTab(3);
            }, function(error){
                console.log(error);
            });
        };
        
}]);