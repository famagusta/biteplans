/* global app, moment, $, console */

app.controller('planController', ['$scope', 'AuthService', 'searchService',
    '$location', 'planService', 'stars', 'starsUtility', '$window', '$rootScope',
    'constants', '$routeParams',
    function($scope, AuthService, searchService, $location, planService, stars,
        starsUtility, $window, $rootScope, constants, $routeParams)
    {
        'use strict';
        var params = $routeParams;
        
        $scope.query_plan = params.query ? params.query : null;
        $scope.sortby = params.sortby ? params.sortby : '';
        $scope.page = params.page? params.page : 1;

        $scope.plans = {};
        $scope.userPlanRatings = [];
        
        $scope.userPlans = [];
        
        $scope.activityLevelChoices = ['Sedentary', 'Mild Activity',
                                       'Moderate Activity','Heavy Activity',
                                       'Very Heavy Activity'];
        var activityLevelChoicesDict = {
            'Sedentary': 'S',
            'Mild Activity': 'MA',
            'Moderate Activity': 'OA',
            'Heavy Activity': 'HA',
            'Very Heavy Activity': 'VHA'
        };

        var reverseActivityLevelChoicesDict = {
            'S': 'Sedentary',
            'MA': 'Mild Activity',
            'OA': 'Moderate Activity',
            'HA': 'Heavy Activity',
            'VHA': 'Very Heavy Activity'
        };
        
        $scope.activityDescriptions = {
            'Sedentary': 'Little or no Exercise/ desk job',
            'Mild Activity': 'Light exercise/ sports 1 – 3 days/ week',
            'Moderate Activity': 'Moderate Exercise, sports 3 – 5 days/ week',
            'Heavy Activity': 'Heavy Exercise/ sports 6 – 7 days/ week',
            'Very Heavy Activity': 'Very heavy exercise/ physical job/ training 2 x/ day'
        };
        
        $scope.updateSortby = function(val){
            $scope.sortby = val;
            $scope.search_plan();
        };
        
        $scope.updatePaginate = function(val){
            $scope.page = val;
            $scope.search();
        }
        
        var getUserPlanRatings = function()
        {
            planService.getUserDietPlanRatings().then(function(
                response)
            {
                $scope.userPlanRatings = response;
            }, function(error)
            {
                console.log(error);
            });
        };
        
        
        var getUserPlans = function(){
            planService.getUserDietPlans().then(function(response){
                $scope.userPlans = response.results;
            }, function(error){
                console.log(error);
            });
        };

        
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
            var page = $scope.page;
            var sortby = $scope.sortby;
            if (query)
            {
                $location.search('query', query); 
                $location.search('page', page);
                $location.search('sortby', sortby);
                
                searchService.search_plan(query, page, sortby).then(function(
                    response)
                {
                    $scope.plans = response;
                    $scope.currentPage = page;
                    $scope.pageSize = response.total*6;
                    for (var i = 0; i < $scope.plans.results
                        .length; i++){
                        $scope.plans.results[i].showStars =
                            true;
                        $scope.plans.results[i].activity_level = reverseActivityLevelChoicesDict[$scope.plans.results[i].activity_level];
                    }
                }, function(error)
                {
                    console.log(error);
                });
            }
        };
        
        $scope.populate_search = function(){
            if(!$scope.query_plan){
                searchService.list_latest_plans().then(function(response){
                    $scope.plans = response;
                    $scope.currentPage = $scope.page;
                    $scope.pageSize = response.total*6;
                    for (var i = 0; i < $scope.plans.results
                        .length; i++){
                        $scope.plans.results[i].showStars =
                            true;
                        $scope.plans.results[i].activity_level = reverseActivityLevelChoicesDict[$scope.plans.results[i].activity_level];
                    }
                }, function(error){
                    console.log(error);
                })
            }
        }
        
        if($scope.query_plan){
            $scope.search_plan();
        }else {
            $scope.populate_search();
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
            return $scope.plans.results[idxDietPlan]
                .average_rating * 20;
        };
        
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
            };
            if (constants.userOb.status && $scope.userPlanRatings !==
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
                    
                    if (userRatingMatch.length > 0)
                    {
                        // find index of diet plan in results - we need to update it 
                        var idxDietPlan = findWithAttr($scope.plans.results,
                            'id', userRatingMatch[0].dietPlan);
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
                                });
                            }, function(error)
                            {
                                console.log(error);
                            });
                        }
                    }
                    else
                    {
                        // case where this is a fresh rating
                        planService.createDietPlanRating(
                            ratingObject).then(function(response)
                        {
                            // update user ratings array
                            getUserPlanRatings();
                        }, function(error)
                        {
                            console.log(error);
                        });
                    }
                }
            }else{
                /* prompt user for login */
                $rootScope.$emit('authFailure');
            }
        };
        
        $scope.openShortInfoModal = function()
        {
            $('#small-modal').openModal();
        };
        
        $scope.createPlan = function()
        {
            if(constants.userOb.status)
            planService.createPlan($scope.plan).then(function(
                response)
            {
                $location.path('/dietplans/create/overview/' + response.dietplan_id);
                $('#small-modal').closeModal();
            }, function(error)
            {
                console.log(error);
            });
        };
        
        /* function to follow a plan given a dietplan id
           and user selected date. did this using jquery 
           since we wanted a button to trigger the series
           of events */
        $scope.followPlan = function(plan)
        {
            /* something strange happens inside datepicker with local variables */
            $scope.selected_plan = plan;
            $scope.followPlanObject = {};
            
            if(constants.userOb.status){
                var $input = $('.datepicker_btn')
                .pickadate({
                    format: 'yyyy-mm-dd',
                    formatSubmit: false,
                    closeOnSelect: true,
                    onSet: function(context){
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
                            $scope.followPlanObject = {
                                dietplan: $scope.selected_plan.id,
                                start_date: $scope.followDate
                            };
                            planService.followDietPlan(
                                $scope.followPlanObject).then(
                                function(response)
                                {
                                    if(response.error){
                                        $scope.followPlanError = "Sorry, selected Date conflicts with another dietplan on the same day! Please select another date.";
                                    }else{
                                        $scope.followPlanStatus = "Successfully added plan to your Meal Calendar.";
                                    }
                                }, function(error)
                                {
                                    
                                    console.log(error);
                                });
                        }
                    }
                });
            }
            else{
                /* prompt user for login */
                $rootScope.$emit('authFailure');
            }
        };
        
        /* shortlist the selected plan */
        $scope.shortlistPlan = function(planId)
        {
            if(constants.userOb.status){
                /* check authentication */
                if(!$scope.checkMyPlans(planId)){
                    /* post if plan not already in the basket */
                    var objToSave = {
                        dietplan: planId
                    };
                    planService.addPlanToShortlist(objToSave).then(function(
                        response)
                    {
                       getUserPlans();
                    }, function(error)
                    {
                        console.log(error);
                    });
                }
                else{
                    /* delete if plan already shortlisted */
                    var userPlanMatch = $scope.userPlans.filter(
                        function(el)
                        {
                            return el.dietplan.id === planId;
                        });
                    planService.removePlanFromShortlist(userPlanMatch[0].id).then(function(
                        response)
                    {
                        getUserPlans();
                    }, function(error)
                    {
                        console.log(error);
                    });
                }
            }
            else{
                /* prompt user for login */
                $rootScope.$emit('authFailure');
            }
        };
        
        
        $scope.checkMyPlans = function(planId){
            //TBD
            if(constants.userOb.status){
                var userPlanMatch = $scope.userPlans.filter(
                        function(el)
                        {
                            return el.dietplan.id === planId;
                        });
                if (userPlanMatch.length > 0){
                    return true;
                }
                return false;
            }else{
                return false;
            }
        };
        
        
        $scope.getPlanNutrientPercent = function(plan, nutrient)
        {
            var conversion_factor = 4;
            if (nutrient === 'fat_tot')
            {
                conversion_factor = 9;
            }
            var nutrient_percent = 100 * conversion_factor *
                parseFloat(plan[nutrient]) / parseFloat(plan.energy_kcal);
            return nutrient_percent;
        };
        
    
        $scope.checkAuth4PlanCreate = function(){
            if(constants.userOb.status){
                $scope.openShortInfoModal();
            }
            else{
                $rootScope.$emit('authFailure');
            }
        };
        
        $scope.openPlanDetails = function(planId){
            $location.path('/dietplans/view-diet-plan/' + planId +'/');
        };
        
        $scope.getFilterLabel = function(filter){
            
            var filterNames ={
                'average_rating': "Rating",
                'carbohydrate_tot': "Carbohydrates",
                'protein_tot': "Proteins",
                'fat_tot': "Fats",
                'energy_kcal': "Calories"
            };
            return filterNames[filter];
        };
        
        $scope.factor = 50;
        
        if(constants.userOb.status){
            getUserPlanRatings();
            getUserPlans();
        }
    }
]);