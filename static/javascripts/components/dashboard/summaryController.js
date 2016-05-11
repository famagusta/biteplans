'use strict'

/* Angular Controller for summary tab on dashboard. Allows a user to check followed items of a plan */

app.controller('summaryCtrl', ['$scope', 'summaryService',function ($scope, summaryService){
    $scope.plan_data = [];
    $scope.today = moment();
    $scope.navDates = {
        current: moment(),
        next: moment().add(1, "days"),
        prev: moment().subtract(1, "days")
    }
    $scope.navTitles = {
        current: "Today",
        prev: "Yesterday",
        next: "Tomorrow"
    }
        
    //function to retrieve a particular days diet plan
    $scope.getDayPlan = function(dateString){
        summaryService.getUserDayPlan(dateString)
            .then(function(response){
                $scope.plan_data = response;
            console.log(response);
//                for(var i=0; i<response.length; i++){
//                    var objToShow = {
//                        title: response[i].name,
//                    }
//                    $scope.plan_data.push(objToShow);
//                }
//                console.log($scope.plan_data);
            }, function(error){
                console.log(error);
          });
    }
    
    var dateString = $scope.today.format('YYYY-MM-DD');
    $scope.getDayPlan(dateString);
    
    
    $scope.getNextDay = function(direction){
        console.log($scope.navDates);
        if (direction===1){
            $scope.navDates.current.add(1, "days");
            $scope.navDates.next.add(1, "days");
            $scope.navDates.prev.add(1, "days");
        } else if (direction===-1){
            $scope.navDates.current.subtract(1, "days");
            $scope.navDates.next.subtract(1, "days");
            $scope.navDates.prev.subtract(1, "days");
        }
        $scope.checkNavTitle();
        $scope.getDayPlan($scope.navDates.current.format('YYYY-MM-DD'));
    }
    
    /*check whether selected date is same as today, 
    yesterday or tomorrow and set titles accordingly*/
    $scope.checkNavTitle = function(){
         console.log("today : " + $scope.today.format('YYYY-MM-DD'));
         console.log("currdate : " + $scope.navDates.current.format('YYYY-MM-DD'));
         var diff = Math.round($scope.today.diff($scope.navDates.current, 'days', true));
        console.log(diff);
        if(diff===0){
            $scope.navTitles = {
                current: "Today",
                prev: "Yesterday",
                next: "Tomorrow"
            }
        }else if(diff===-1){
            $scope.navTitles = {
                current: "Tomorrow",
                prev: "Today",
                next: $scope.navDates.next.format('YYYY-MM-DD')
            }
        }else if(diff===1){
            $scope.navTitles = {
                current: "Yesterday",
                prev: $scope.navDates.prev.format('YYYY-MM-DD'),
                next: "Today"
            }
        }else if(diff===-2){
            $scope.navTitles = {
                current: $scope.navDates.current.format('YYYY-MM-DD'),
                prev: "Tomrrow",
                next: $scope.navDates.next.format('YYYY-MM-DD')
            }
        }else if(diff===2){
            $scope.navTitles = {
                current: $scope.navDates.current.format('YYYY-MM-DD'),
                prev: $scope.navDates.prev.format('YYYY-MM-DD'),
                next: "Yesterday"
            }
        }else{
            $scope.navTitles = {
                current: $scope.navDates.current.format('YYYY-MM-DD'),
                prev: $scope.navDates.prev.format('YYYY-MM-DD'),
                next: $scope.navDates.next.format('YYYY-MM-DD')
            }
        }
    }
                               

    
    
    
}]);