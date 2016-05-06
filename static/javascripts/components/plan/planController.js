'use strict';
app.controller('planController', ['$scope', 'AuthService', 'searchService',
    '$location', 'planService',
    function($scope, AuthService, searchService, $location,
        planService) {
        
        $scope.query_plan = '';
        $scope.plans = {};
        
        /* date that user selects to start following a plan*/
        $scope.followDate = '';
        
        $scope.search_plan = function() {
            var query = $scope.query_plan;
            if (query) {
                searchService.search_plan(query)
                    .then(function(response) {
                        $scope.plans = response;
                    }, function(error) {
                        console.log(error);
                    });
            }
        };
        
        $scope.openShortInfoModal = function() {
            $('#small-modal')
                .openModal();
        }

        $scope.createPlan = function() {

            planService.createPlan($scope.plan)
                .then(function(response) {
                    console.log(response);
                    $location.path('/plan/' + response.dietplan_id);
                    $('#small-modal')
                        .closeModal();

                }, function(error) {
                    console.log(error);
                })
        };
        
        /* function to follow a plan given a dietplan id
           and user selected date. did this using jquery 
           since we wanted a button to trigger the series
           of events */
        $scope.followPlan = function(planId){
            var $input = $('.datepicker_btn').pickadate({
                format : 'yyyy-mm-dd',
                onSet: function(context) {
                    //make api call to follow the plan on setting of date
                    /* convert to ISO 8601 date time string for serializer
                      acceptance*/
                    var date_to_set = new Date(context.select).toISOString();
                    $scope.followDate = date_to_set;
                    
                    //close the date picker
                    this.close();
                    
                    //
                    var followPlanObject = {
                        dietplan:planId,
                        start_date: $scope.followDate
                    }
                    planService.followDietPlan(followPlanObject)
                        .then(function(response){
                            console.log(response);
                    }, function(error){
                        console.log(error);
                    });
                }
            })
        }
        
        
        $scope.myDate = new Date();
  $scope.minDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth() - 2,
      $scope.myDate.getDate());
  $scope.maxDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth() + 2,
      $scope.myDate.getDate());
  $scope.onlyWeekendsPredicate = function(date) {
    var day = date.getDay();
    return day === 0 || day === 6;
  }
    }
]);