'use strict';
app.controller('planController', ['$scope', 'AuthService', 'searchService',
    '$location', 'planService',
    function($scope, AuthService, searchService, $location,
        planService) {
        
        $scope.query_plan = '';
        $scope.plans = {};
//        $scope.ratings = {};
//        $scope.ratings.rate = 34;
//
//        $scope.ratings.max = 5;

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
        
        $scope.getPlanRating = function(plan){
            console.log('fire');
            return parseFloat(plan.average_rating)*20;
        }
        $scope.openShortInfoModal = function() {
            $('#small-modal')
                .openModal();
        }

        $scope.createPlan = function() {

            planService.createPlan($scope.plan)
                .then(function(response) {
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
                formatSubmit: false,
                closeOnSelect: true,

                onSet: function(context) {
                    //make api call to follow the plan on setting of date
                    /* convert to ISO 8601 date time string for serializer
                      acceptance*/
                    if(context.select){
                        var date_to_set = new Date(context.select).toISOString();
                        $scope.followDate = moment(date_to_set).format('YYYY-MM-DD');

                        //close the date picker
                        this.close();

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
                }
            })
        }
//        $scope.starRating3 = 5;
//        $scope.hoverRating3 = 0;
//
//        
//        $scope.click3 = function (param) {
//            //update database
//            $scope.starRating3 = param
//        };
//
//        $scope.mouseHover3 = function (param) {
//            $scope.hoverRating3 = param;
//        };
//
//        $scope.mouseLeave3 = function (param) {
//            $scope.hoverRating3 = param + '*';
//        };
        
        
        $scope.getPlanNutrientPercent = function(plan, nutrient){
            var conversion_factor = 4;
            if (nutrient === 'fat_tot'){
                conversion_factor = 9;
            }
                
            var nutrient_percent = 100*conversion_factor*parseFloat(plan[nutrient])
                /parseFloat(plan['energy_kcal']);
            return nutrient_percent;
        }
    }
]);