'use strict'
// controller for the calendar. accessed by dashboard.html

app.config(function($mdThemingProvider) {
    $mdThemingProvider
        .theme("default")
        .primaryPalette("cyan")
        .accentPalette("light-green");
});

app.controller("calendarCtrl", ['$scope', '$filter', '$q', '$timeout', '$log',
                                'httpService', 'AuthService',
                                'MaterialCalendarData', 'calendarService', 
                                function($scope, $filter, $q, $timeout, $log,
                                          httpService, AuthService,
                                MaterialCalendarData, calendarService) {
    $scope.selectedDate = new Date();
    $scope.weekStartsOn = 0;
    $scope.dayFormat = "d";
    $scope.tooltips = true;
    $scope.disableFutureDates = false;


    $scope.setDirection = function(direction) {
        $scope.direction = direction;
        $scope.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
    };

    $scope.dayClick = function(date) {
        $scope.tab.dateClick = $filter("date")(date, "y-MM-d");
//        $scope.tab.tab = 1;
        $scope.setTab(1);
    };

    $scope.prevMonth = function(data) {
    };

    $scope.nextMonth = function(data) {
    };

    $scope.setContentViaService = function() {
        var today = new Date();
        MaterialCalendarData.setDayContent(today, '<span> :oD </span>')
    }



                                    

    $scope.getDietCalendarTitle = function(key, timetable){
        var key = moment(key);
        /* check all dietplans to see if any of them fall on a this particular day */
        for(var i=0; i<timetable.length; i++){
            /* declare start and end date of a given diet plan */
            var start_date = moment(timetable[i].start_date);
            var end_date = moment(timetable[i].start_date)
                            .add(timetable[i].dietplan.duration, "w");
            
            /* check if given key date is between start and end date of any dietplan */
            if (key.isSameOrAfter(start_date) && key.isBefore(end_date)){
                return timetable[i].dietplan.name;
            } 
        }
    }
                                    

    $scope.currMonthPromise = null;
    $scope.currMonthContext = null;                                
    /* This function sets the contents of a day and is called asynchronously*/
    $scope.setDayContent = function(date) {
        
        var key = moment(date).format('YYYY-MM-DD');
        if ($scope.currMonthContext !== moment(date).month()){

            $scope.currMonthContext = moment(date).month();
            
            var deferred = $q.defer();
            var url = '/dashboard/follow/' + '?date=' + key;
            /* get request for getting the dietplans a user is following in a month */
            httpService.httpGet(url)
                    .then(function(response) {
                        deferred.resolve(response);
                        console.log(response);
                    }, function(error) {
                        deferred.reject(error);
                    });
            /* chained promises to get the correct text represnetation of the 
            date */
            var promiseB = deferred.promise.then(function(result){
                return $scope.getDietCalendarTitle(key, result);
            })
            $scope.currMonthPromise = deferred;
            return promiseB;
        
        } else {
            
            var promiseB = $scope.currMonthPromise.promise.then(function(result){
                return $scope.getDietCalendarTitle(key, result);
            });
            return promiseB;
        } 
        
    };
}]);