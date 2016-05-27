'use strict';
app.controller('planController', ['$scope', 'AuthService', 'searchService',
    '$location', 'planService', 'stars', 'starsUtility',
    function($scope, AuthService, searchService, $location, planService, stars,
        starsUtility)
    {
        $scope.query_plan = '';
        $scope.plans = {};
        $scope.userPlanRatings = [];
        $scope.isAuth = false;
        AuthService.isAuthenticated().then(function(response)
        {
            $scope.isAuth = response.status;
        });
        var getUserPlanRatings = function()
        {
            planService.getUserDietPlanRatings().then(function(
                response)
            {
                $scope.userPlanRatings = response;
            }, function(error)
            {
                console.log(error);
            })
        }
        getUserPlanRatings();

        function findWithAttr(array, attr, value)
            {
                for (var i = 0; i < array.length; i += 1)
                {
                    if (array[i][attr] === value)
                    {
                        return i;
                    }
                }
            }
            /* date that user selects to start following a plan*/
        $scope.followDate = '';
        $scope.search_plan = function()
        {
            var query = $scope.query_plan;
            if (query)
            {
                searchService.search_plan(query).then(function(
                    response)
                {
                    $scope.plans = response;
                    for (var i = 0; i < $scope.plans.results
                        .length; i++)
                    {
                        $scope.plans.results[i].showStars =
                            true;
                    }
                }, function(error)
                {
                    console.log(error);
                });
            }
        };
        $scope.getPlanRating = function(plan)
        {
            // bind result to results array
            var planRatingMatch = $scope.plans.results.filter(
                function(el)
                {
                    return el.id === plan.id;
                });
            var idxDietPlan = findWithAttr($scope.plans.results,
                'id', planRatingMatch[0].id);
            return $scope.plans.results[idxDietPlan][
                'average_rating'
            ] * 20;
        }
        $scope.setPlanRating = function(plan, rating)
        {
            /* Handle following cases
                1. user sets rating for a plan for the 1st time
                2. user updates rating for a plan he rated before
                    2.a. user tries to set same rating as before
                3. the function is triggered by extra firing of 
                    star input directive -- FIX this is future
                must also check if user is logged in to do this
            */
            var normalizedRating = Math.ceil(rating / 20);
            var ratingObject = {
                rating: normalizedRating,
                dietPlan: plan.id
            }
            if ($scope.isAuth && $scope.userPlanRatings !==
                undefined)
            {
                // only authenticated users must rate plans
                if (normalizedRating > 0)
                {
                    // this takes care of erroneous firing of function
                    // find if user has rated this plan before - decide b/w post & patch
                    var userRatingMatch = $scope.userPlanRatings.filter(
                        function(el)
                        {
                            return el.dietPlan === plan.id;
                        });
                    // find index of diet plan in results - we need to update it 
                    var idxDietPlan = findWithAttr($scope.plans.results,
                        'id', userRatingMatch[0].dietPlan);
                    if (userRatingMatch.length > 0)
                    {
                        // case where user has previously rated this plan
                        if (userRatingMatch[0].rating !==
                            normalizedRating)
                        {
                            //case where user is updating his/her rating
                            planService.updateDietPlanRating(
                                ratingObject, userRatingMatch[0]
                                .id).then(function(response)
                            {
                                //update user ratings array
                                getUserPlanRatings();
                                // update dietplan rating
                                var plan2Update = {};
                                planService.getDietPlan(
                                    userRatingMatch[0].dietPlan
                                ).then(function(
                                    response)
                                {
                                    $scope.plans.results[
                                            idxDietPlan
                                            ] =
                                        response;
                                }, function(error)
                                {
                                    console.log(
                                        error);
                                })
                            }, function(error)
                            {
                                console.log(error);
                            })
                        }
                    }
                    else
                    {
                        // case where this is a fresh rating
                        planService.createDietPlanRating(
                            ratingObject).then(function(
                            response)
                        {
                            // update user ratings array
                            getUserPlanRatings();
                        }, function(error)
                        {
                            console.log(error);
                        })
                    }
                }
            }
        }
        $scope.openShortInfoModal = function()
        {
            $('#small-modal').openModal();
        }
        $scope.createPlan = function()
        {
            planService.createPlan($scope.plan).then(function(
                response)
            {
                $location.path('/plan/' + response.dietplan_id);
                $('#small-modal').closeModal();
            }, function(error)
            {
                console.log(error);
            })
        };
        /* function to follow a plan given a dietplan id
           and user selected date. did this using jquery 
           since we wanted a button to trigger the series
           of events */
        $scope.followPlan = function(planId)
        {
            var $input = $('.datepicker_btn').pickadate(
            {
                format: 'yyyy-mm-dd',
                formatSubmit: false,
                closeOnSelect: true,
                onSet: function(context)
                {
                    //make api call to follow the plan on setting of date
                    /* convert to ISO 8601 date time string for serializer
                      acceptance*/
                    if (context.select)
                    {
                        var date_to_set = new Date(
                            context.select).toISOString();
                        $scope.followDate = moment(
                            date_to_set).format(
                            'YYYY-MM-DD');
                        //close the date picker
                        this.close();
                        var followPlanObject = {
                            dietplan: planId,
                            start_date: $scope.followDate
                        }
                        planService.followDietPlan(
                            followPlanObject).then(
                            function(response)
                            {
                                console.log(
                                    response);
                            }, function(error)
                            {
                                console.log(error);
                            });
                    }
                }
            })
        }
        $scope.addPlanToShortlist = function(planId)
        {
            console.log(planId);
            var objToSave = {
                dietplan: planId
            }
            planService.addPlanToShortlist(objToSave).then(function(
                response)
            {
                console.log(response);
            }, function(error)
            {
                console.log(error);
            })
        }
        $scope.getPlanNutrientPercent = function(plan, nutrient)
        {
            var conversion_factor = 4;
            if (nutrient === 'fat_tot')
            {
                conversion_factor = 9;
            }
            var nutrient_percent = 100 * conversion_factor *
                parseFloat(plan[nutrient]) / parseFloat(plan[
                    'energy_kcal']);
            return nutrient_percent;
        }
    }
]);