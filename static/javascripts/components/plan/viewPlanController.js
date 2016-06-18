/* controller for createplan pages */
/* jshint -W106 */
/* jshint -W004 */
/* jshint -W083 */

/* global app, $, console */

app.controller('viewPlanController', ['$scope', '$window', 'AuthService',
    '$routeParams', 'searchService', '$location', 'planService', '$rootScope',
    'constants',
    function($scope, $window, AuthService, $routeParams, searchService,
        $location, planService, $rootScope, constants)
    {
        'use strict';
        
        /* NO AUTH REQUIRED */
       
        var params = $routeParams;

        var urlParamWeek1 = params.week1? parseInt(params.week1) : 1;
        var urlParamDay1 = params.day1? parseInt(params.day1) : 1;

        var urlParamWeek2 = params.week2? parseInt(params.week2) : 1;
        var urlParamDay2 = params.day2? parseInt(params.day2) : 2;

        
        /*if authed then create these objects*/
        /* week & day count for current plan */
        $scope.weekCount = [];
        $scope.dayCount = [];


        $scope.dayWeekNos = 0;
        $scope.currentDayWeekNos = 7*(urlParamWeek1 - 1) + urlParamDay1;

        $scope.currentDayWeekNos2 = 7*(urlParamWeek2 - 1) + urlParamDay2;
        /* stores the details to get current day plan
                this is used to make the first query */
        $scope.dayplan1 = {
            'day_no':  urlParamDay1,
            'week_no': urlParamWeek1
        };

        $scope.dayplan2 = {
            'day_no':  urlParamDay2,
            'week_no': urlParamWeek2
        };

        var activityLevelChoicesDict = {
            'S': 'Sedentary',
            'MA': 'Mild Activity',
            'OA': 'Moderate Activity',
            'HA': 'Heavy Activity',
            'VHA': 'Very Heavy Activity'
        };
        
        /* get the diet plan in question from the server */
        planService.getDietPlan($routeParams.id).then(
            function(response)
            {
                $scope.plan = response;
                $scope.plan.activity_level = 
                    activityLevelChoicesDict[response.activity_level];
                /* rewrite some object variables in correct format
                        as the response object stringifies everything */
                $scope.plan.age = parseInt($scope.plan
                    .age);
                $scope.plan.height = parseFloat(
                    $scope.plan.height);
                $scope.plan.weight = parseFloat(
                    $scope.plan.weight);
                $scope.plan.duration = parseInt(
                    $scope.plan.duration);
                $scope.dayWeekNos = $scope.plan.duration*7;

                for (var i = 1; i <= $scope.plan.duration; i++)
                {
                    $scope.weekCount.push(
                    {
                        'id': i,
                        'name': 'Week' +
                            ' ' + i
                    });
                }
                for (var j = 1; j <= 7; j++)
                {
                    $scope.dayCount.push(
                    {
                        'id': j,
                        'name': 'Day' + ' ' +
                            j
                    });
                }
            }, function(error)
            {
                console.log(error);
            });

        /*opens jump to or copy to modal*/
        $scope.openJumpToModal = function(type)
        {
            $scope.jumpToModalType = type;
            $('#jump-to-modal').openModal();
        };

        //function to copy the current day plan and jump to feature
        //type determines what is the task
        //if type is copy then it will copy
        //if type is jump then it will jump
        $scope.daySelect = function(type, week, day)
        {
            if (type === 'copy')
            {
                if (day !== $scope.dayplan.day_no ||
                    week !== $scope.dayplan.week_no)
                {
                    planService.copyDayPlan(
                    {
                        'from_day': $scope.dayplan
                            .day_no,
                        'from_week': $scope
                            .dayplan.week_no,
                        'to_day': day,
                        'to_week': week,
                        'dietplan': $scope.plan
                            .id
                    }).then(function()
                    {
                        $('#jump-to-modal')
                            .closeModal();
                    }, function(error)
                    {
                        console.log(error);
                    });
                }
            }
            else if (type === 'jump')
            {
                $scope.dayplan.day_no = parseInt(
                    day);
                $scope.dayplan.week_no = parseInt(
                    week);
                $scope.getDayPlan($scope.dayplan.day_no,
                    $scope.dayplan.week_no);
                $('#jump-to-modal').closeModal();
            }
        };

        /* Function to update day_no or week_no */

        $scope.updateDayPlan1 = function(param, val)
        {
            // made shorter with ternary operator and modulo division
            var multiplier = param === 'week_no' ? 7 : param === 'day_no' ? 1 : 0;

            $scope.currentDayWeekNos += (multiplier*val);

            if($scope.currentDayWeekNos > $scope.dayWeekNos){
                $scope.currentDayWeekNos = $scope.currentDayWeekNos % 
                $scope.dayWeekNos;
            }else if ($scope.currentDayWeekNos <= 0){
                $scope.currentDayWeekNos = $scope.currentDayWeekNos + 
                $scope.dayWeekNos;
            }

            $scope.dayplan1.day_no = ($scope.currentDayWeekNos % 7);
            if($scope.dayplan1.day_no === 0){
                $scope.dayplan1.day_no = 7;
            }
            $scope.dayplan1.week_no = Math.ceil($scope.currentDayWeekNos/7);

            $scope.getDayPlan($scope.dayplan1.day_no,
                    $scope.dayplan1.week_no, 1);

        };

        $scope.updateDayPlan2 = function(param, val)
        {
            // made shorter with ternary operator and modulo division
            var multiplier = param === 'week_no' ? 7 : param === 'day_no' ? 1 : 0;

            $scope.currentDayWeekNos2 += (multiplier*val);

            if($scope.currentDayWeekNos2 > $scope.dayWeekNos){
                $scope.currentDayWeekNos2 = $scope.currentDayWeekNos2 % 
                $scope.dayWeekNos;
            }else if ($scope.currentDayWeekNos2 <= 0){
                $scope.currentDayWeekNos2 = $scope.currentDayWeekNos2 + 
                $scope.dayWeekNos;
            }

            $scope.dayplan2.day_no = ($scope.currentDayWeekNos2 % 7);
            if($scope.dayplan2.day_no === 0){
                $scope.dayplan2.day_no = 7;
            }
            $scope.dayplan2.week_no = Math.ceil($scope.currentDayWeekNos2/7);

            $scope.getDayPlan($scope.dayplan2.day_no,
                    $scope.dayplan2.week_no, 2);

        };

        // TODO: update for API
        $scope.getDayPlan = function(day, week, col)
        {
            var id = $routeParams.id;
            planService.getdayplan(id, day, week).then(
                function(response)
                { 
                    if(col===1){
                    $scope.dayplan1.id =
                        response.id;
                    $scope.dayplan1.day_no =
                        response.day_no;
                    $scope.dayplan1.week_no =
                        response.week_no;}

                    else if(col===2){
                    $scope.dayplan2.id =
                        response.id;
                    $scope.dayplan2.day_no =
                        response.day_no;
                    $scope.dayplan2.week_no =
                        response.week_no;}

                    for (var i = 0; i <
                        response.mealplan.length; i++
                    )
                    {
                        response.mealplan[i].mealname =
                            response.mealplan[i]
                            .name;
                        delete response.mealplan[
                            i].name;
                        var dateStr =
                            'July 21, 1983 ' +
                            response.mealplan[i]
                            .time;
                        var b = new Date(
                            dateStr);
                        response.mealplan[i].time =
                            b;
                        response.mealplan[i].counter =
                            i;
                        /* coerce string responses into floats to avoid angular error
                                do samething for recipes as well. check null cases */
                        for (var j = 0; j <
                            response.mealplan[i]
                            .mealingredient.length; j++
                        )
                        {
                            response.mealplan[i]
                                .mealingredient[
                                    j].quantity =
                                parseFloat(
                                    response.mealplan[
                                        i].mealingredient[
                                        j].quantity
                                );
                        }
                        // TODO: similar thing for recipes
                        //parse recipe servings to float
                        for (var j = 0; j <
                            response.mealplan[i].mealrecipe.length; j++)
                        {
                            response.mealplan[i]
                                .mealrecipe[j].servings =
                                parseFloat(
                                    response.mealplan[
                                        i].mealrecipe[
                                        j].servings
                                );
                        }
                    }
                    if(col===1){
                    $scope.mealPlanNameArray =
                        response.mealplan;
                    for (var m = 0; m < $scope.mealPlanNameArray
                        .length; m++)
                    {
                        $scope.mealPlanNameArray[
                            m].mealNutrition = {};
                    }
                }
                else{
                    $scope.mealPlanNameArray2 =
                        response.mealplan;
                    for (var m = 0; m < $scope.mealPlanNameArray2
                        .length; m++)
                    {
                        $scope.mealPlanNameArray2[
                            m].mealNutrition = {};
                    }

                }
                }, function(error)
                {
                    console.log(error);
                });
                
                
                if(!($scope.dayplan1.day_no===1 && $scope.dayplan2.week_no===1 && $scope.dayplan2.day_no===2 && $scope.dayplan1.week_no===1)){
                    if(col===1){
                        $location.search('week1', week);
                        $location.search('day1', day);
                    }else if(col===2){
                        $location.search('week2', week);
                        $location.search('day2', day);
                    }
                }
        };

        //get initial data for day1 and week 1 of the plan
        $scope.getDayPlan($scope.dayplan1.day_no, $scope
            .dayplan1.week_no, 1);


        $scope.getDayPlan($scope.dayplan2.day_no, $scope
            .dayplan2.week_no, 2);



        // function to populate additional ingredients info inside mealplan array
        $scope.getAdditionalIngredientsInfo = function()
        {
            if ($scope.mealPlanNameArray !==
                undefined)
            {
                for (var i = 0; i < $scope.mealPlanNameArray
                    .length; i++)
                {
                    if ($scope.mealPlanNameArray[i]
                        .mealingredient !==
                        undefined)
                    {
                        for (var j = 0; j < $scope.mealPlanNameArray[
                            i].mealingredient.length; j++)

                        {
                            //callback function to deal with the 
                            //asynchronous call within for loop
                            (function(cntr_i,
                                cntr_j)
                            {
                                $scope.mealPlanNameArray[
                                        cntr_i]
                                    .mealingredient[
                                        cntr_j]
                                    .additionalIngInfo = {};
                                searchService.get_ingredient_addtnl_info(
                                    $scope.mealPlanNameArray[
                                        cntr_i
                                    ].mealingredient[
                                        cntr_j
                                    ].ingredient
                                    .id).then(
                                    function(
                                        response
                                    )
                                    {
                                        //model for storing response from API 
                                        $scope
                                            .mealPlanNameArray[
                                                cntr_i
                                            ]
                                            .mealingredient[
                                                cntr_j
                                            ]
                                            .additionalIngInfo =
                                            response;
                                    },
                                    function(
                                        error
                                    )
                                    {
                                        console
                                            .log(
                                                error
                                            );
                                    });
                            })(i, j);
                        }
                    }

                    // same for recipes
                    if ($scope.mealPlanNameArray[i]
                        .mealrecipe !==
                        undefined)
                    {
                        for (var j = 0; j < $scope.mealPlanNameArray[
                            i].mealrecipe.length; j++)
                        {
                            //callback function to deal with the 
                            //asynchronous call within for loop
                            (function(cntr_i,
                                cntr_j)
                            {
                                $scope.mealPlanNameArray[
                                        cntr_i]
                                    .mealrecipe[
                                        cntr_j]
                                    .additionalRecInfo = {};
                                searchService.get_recipe_addtnl_info(
                                    $scope.mealPlanNameArray[
                                        cntr_i
                                    ].mealrecipe[
                                        cntr_j
                                    ].recipe
                                    .id).then(
                                    function(
                                        response
                                    )
                                    {
                                        //model for storing response from API 
                                        $scope
                                            .mealPlanNameArray[
                                                cntr_i
                                            ]
                                            .mealrecipe[
                                                cntr_j
                                            ]
                                            .additionalRecInfo =
                                            response;
                                    },
                                    function(
                                        error
                                    )
                                    {
                                        console
                                            .log(
                                                error
                                            );
                                    });
                            })(i, j);
                        }
                    }
                }
            }
        };



        $scope.getAdditionalIngredientsInfo2 = function()
        {
            if ($scope.mealPlanNameArray2 !==
                undefined)
            {
                for (var i = 0; i < $scope.mealPlanNameArray2
                    .length; i++)
                {
                    if ($scope.mealPlanNameArray2[i]
                        .mealingredient !==
                        undefined)
                    {
                        for (var j = 0; j < $scope.mealPlanNameArray2[
                            i].mealingredient.length; j++)
                        {
                            //callback function to deal with the 
                            //asynchronous call within for loop
                            (function(cntr_i, cntr_j)
                            {
                                $scope.mealPlanNameArray2[
                                        cntr_i]
                                    .mealingredient[
                                        cntr_j]
                                    .additionalIngInfo = {};
                                searchService.get_ingredient_addtnl_info(
                                    $scope.mealPlanNameArray2[
                                        cntr_i
                                    ].mealingredient[
                                        cntr_j
                                    ].ingredient
                                    .id).then(
                                    function(
                                        response
                                    )
                                    {
                                        //model for storing response from API 
                                        $scope
                                            .mealPlanNameArray2[
                                                cntr_i
                                            ]
                                            .mealingredient[
                                                cntr_j
                                            ]
                                            .additionalIngInfo =
                                            response;
                                    },
                                    function(
                                        error
                                    )
                                    {
                                        console
                                            .log(
                                                error
                                            );
                                    });
                            })(i, j);
                        }
                    }

                    // same for recipes
                    if ($scope.mealPlanNameArray2[i]
                        .mealrecipe !==
                        undefined)
                    {
                        for (var j = 0; j < $scope.mealPlanNameArray2[
                            i].mealrecipe.length; j++)
                        {
                            //callback function to deal with the 
                            //asynchronous call within for loop
                            (function(cntr_i,
                                cntr_j)
                            {
                                $scope.mealPlanNameArray2[
                                        cntr_i]
                                    .mealrecipe[
                                        cntr_j]
                                    .additionalRecInfo = {};
                                searchService.get_recipe_addtnl_info(
                                    $scope.mealPlanNameArray2[
                                        cntr_i
                                    ].mealrecipe[
                                        cntr_j
                                    ].recipe
                                    .id).then(
                                    function(
                                        response
                                    )
                                    {
                                        //model for storing response from API 
                                        $scope
                                            .mealPlanNameArray2[
                                                cntr_i
                                            ]
                                            .mealrecipe[
                                                cntr_j
                                            ]
                                            .additionalRecInfo =
                                            response;
                                    },
                                    function(
                                        error
                                    )
                                    {
                                        console
                                            .log(
                                                error
                                            );
                                    });
                            })(i, j);
                        }
                    }
                }
            }
        };
        $scope.$watchCollection('mealPlanNameArray',
            function()
            {
                $scope.getAdditionalIngredientsInfo();
            });

        $scope.$watchCollection('mealPlanNameArray2',
            function()
            {
                $scope.getAdditionalIngredientsInfo2();
            });


        /* Calculates total value of a nutrient across a days plan */
        $scope.calcDayNutrientVal = function(nutrient,
            isAdditional, col)
        {
            var total = 0;
            if(col===1){
            if ($scope.mealPlanNameArray !==undefined && $scope.mealPlanNameArray !== null && 
                $scope.mealPlanNameArray.length>0)
            {
                for (var i = 0; i < $scope.mealPlanNameArray.length; i++)
                {
                    for (var j = 0; j < $scope.mealPlanNameArray[
                        i].mealingredient.length; j++)
                    {
                        if (isAdditional)
                        {
                            /* check if additional ingredient info 
                            has been created or not */
                            if ($scope.mealPlanNameArray[
                                    i].mealingredient[
                                    j] !==
                                undefined && $scope
                                .mealPlanNameArray[
                                    i].mealingredient[
                                    j].additionalIngInfo !==
                                undefined)
                            {
                                total += parseFloat(
                                        $scope.mealPlanNameArray[
                                            i].mealingredient[
                                            j].additionalIngInfo[
                                            nutrient
                                        ]) *
                                    parseFloat(
                                        $scope.mealPlanNameArray[
                                            i].mealingredient[
                                            j].quantity
                                    ) * parseFloat(
                                        $scope.mealPlanNameArray[
                                            i].mealingredient[
                                            j].unit
                                        .weight) /
                                    100;
                            }
                            else
                            {
                                total += 0;
                            }
                        }
                        else
                        {
                            total += parseFloat(
                                    $scope.mealPlanNameArray[
                                        i].mealingredient[
                                        j].ingredient[
                                        nutrient]) *
                                parseFloat($scope.mealPlanNameArray[
                                    i].mealingredient[
                                    j].quantity) *
                                parseFloat($scope.mealPlanNameArray[
                                    i].mealingredient[
                                    j].unit.weight) /
                                100;
                        }
                    }


                    for (var j = 0; j < $scope.mealPlanNameArray[
                        i].mealrecipe.length; j++)
                    {
                        /* check if additional recipe info has been created or not */
                        // TODO
                        if (isAdditional){
                            /* check if additional recipe info 
                            has been created or not */
                            if ($scope.mealPlanNameArray[
                                    i].mealrecipe[
                                    j] !==
                                undefined && $scope
                                .mealPlanNameArray[
                                    i].mealrecipe[
                                    j].additionalRecInfo !==
                                undefined)
                            {
                                total += parseFloat(
                                        $scope.mealPlanNameArray[
                                            i].mealrecipe[
                                            j].additionalRecInfo[
                                            nutrient
                                        ]) *
                                    parseFloat(
                                        $scope.mealPlanNameArray[
                                            i].mealrecipe[
                                            j].servings
                                    );
                            }
                            else
                            {
                                total += 0;
                            }
                        }
                        else{
                            total += parseFloat(
                                    $scope.mealPlanNameArray[
                                        i].mealrecipe[
                                        j].recipe[
                                        nutrient]) *
                                parseFloat($scope.mealPlanNameArray[
                                    i].mealrecipe[
                                    j].servings);
                        }
                    }
                }
            }}

            else if(col===2){
            if ($scope.mealPlanNameArray2 !==undefined && $scope.mealPlanNameArray2 !== null && 
                $scope.mealPlanNameArray2.length>0)
            {
                for (var i = 0; i < $scope.mealPlanNameArray2
                    .length; i++)
                {
                    for (var j = 0; j < $scope.mealPlanNameArray2[
                        i].mealingredient.length; j++)
                    {
                        if (isAdditional)
                        {
                            /* check if additional ingredient info 
                            has been created or not */
                            if ($scope.mealPlanNameArray2[
                                    i].mealingredient[
                                    j] !==
                                undefined && $scope
                                .mealPlanNameArray2[
                                    i].mealingredient[
                                    j].additionalIngInfo !==
                                undefined)
                            {
                                total += parseFloat(
                                        $scope.mealPlanNameArray2[
                                            i].mealingredient[
                                            j].additionalIngInfo[
                                            nutrient
                                        ]) *
                                    parseFloat(
                                        $scope.mealPlanNameArray2[
                                            i].mealingredient[
                                            j].quantity
                                    ) * parseFloat(
                                        $scope.mealPlanNameArray2[
                                            i].mealingredient[
                                            j].unit
                                        .weight) /
                                    100;
                            }
                            else
                            {
                                total += 0;
                            }
                        }
                        else
                        {
                            total += parseFloat(
                                    $scope.mealPlanNameArray2[
                                        i].mealingredient[
                                        j].ingredient[
                                        nutrient]) *
                                parseFloat($scope.mealPlanNameArray2[
                                    i].mealingredient[
                                    j].quantity) *
                                parseFloat($scope.mealPlanNameArray2[
                                    i].mealingredient[
                                    j].unit.weight) /
                                100;
                        }
                    }


                    for (var j = 0; j < $scope.mealPlanNameArray2[
                        i].mealrecipe.length; j++)
                    {
                        /* check if additional recipe info has been created or not */
                        // TODO
                        if (isAdditional){
                            /* check if additional recipe info 
                            has been created or not */
                            if ($scope.mealPlanNameArray2[
                                    i].mealrecipe[
                                    j] !==
                                undefined && $scope
                                .mealPlanNameArray2[
                                    i].mealrecipe[
                                    j].additionalRecInfo !==
                                undefined)
                            {
                                total += parseFloat(
                                        $scope.mealPlanNameArray2[
                                            i].mealrecipe[
                                            j].additionalRecInfo[
                                            nutrient
                                        ]) *
                                    parseFloat(
                                        $scope.mealPlanNameArray2[
                                            i].mealrecipe[
                                            j].servings
                                    );
                            }
                            else
                            {
                                total += 0;
                            }
                        }
                        else{
                            total += parseFloat(
                                    $scope.mealPlanNameArray2[
                                        i].mealrecipe[
                                        j].recipe[
                                        nutrient]) *
                                parseFloat($scope.mealPlanNameArray2[
                                    i].mealrecipe[
                                    j].servings);
                        }
                    }
                }
            }}
            return total;
        };

        /* function to calculate global macronutritients of a given day of 
                    a plan */
        // I THINK THIS IS NO LONGER USED
        $scope.calculateGlobalMacros = function(field, col)
        {
            var GlobalTotal = 0;
            if (col===1 && ($scope.mealPlanNameArray===undefined || $scope.mealPlanNameArray===null || 
                $scope.mealPlanNameArray.length===0) )
            {
                return;
            }
            else if(col===1)
            {
                for (var i = 0; i < $scope.mealPlanNameArray
                    .length; i++)
                {
                    var mealTotal = 0;
                    for (var j = 0; j < $scope.mealPlanNameArray[
                        i].mealingredient.length; j++)
                    {
                        mealTotal += parseFloat(
                                $scope.mealPlanNameArray[
                                    i].mealingredient[
                                    j].ingredient[
                                    field]) *
                            parseFloat($scope.mealPlanNameArray[
                                i].mealingredient[
                                j].quantity) *
                            parseFloat($scope.mealPlanNameArray[
                                i].mealingredient[
                                j].unit.weight) /
                            100;
                    }
                    for (var j = 0; j < $scope.mealPlanNameArray[
                        i].mealrecipe.length; j++)
                    {
                        mealTotal += parseFloat(
                                $scope.mealPlanNameArray[
                                    i].mealrecipe[j]
                                .ingredient[field]) *
                            parseFloat($scope.mealPlanNameArray[
                                    i].mealrecipe[j]
                                .servings);
                    }
                    GlobalTotal += mealTotal;
                    if ($scope.mealPlanNameArray[i]
                        .mealNutrition !==
                        undefined)
                    {
                        $scope.mealPlanNameArray[i]
                            .mealNutrition[field] =
                            mealTotal;
                    }
                }
            }

            else if (col===2 && ($scope.mealPlanNameArray2===undefined || $scope.mealPlanNameArray2===null || 
                $scope.mealPlanNameArray2.length===0) )
            {
                return;
            }
            else if(col===2)
            {
                for (var i = 0; i < $scope.mealPlanNameArray2
                    .length; i++)
                {
                    var mealTotal = 0;
                    for (var j = 0; j < $scope.mealPlanNameArray2[
                        i].mealingredient.length; j++)
                    {
                        mealTotal += parseFloat(
                                $scope.mealPlanNameArray2[
                                    i].mealingredient[
                                    j].ingredient[
                                    field]) *
                            parseFloat($scope.mealPlanNameArray2[
                                i].mealingredient[
                                j].quantity) *
                            parseFloat($scope.mealPlanNameArray2[
                                i].mealingredient[
                                j].unit.weight) /
                            100;
                    }
                    for (var j = 0; j < $scope.mealPlanNameArray2[
                        i].mealrecipe.length; j++)
                    {
                        mealTotal += parseFloat(
                                $scope.mealPlanNameArray2[
                                    i].mealrecipe[j]
                                .ingredient[field]) *
                            parseFloat($scope.mealPlanNameArray2[
                                    i].mealrecipe[j]
                                .servings);
                    }
                    GlobalTotal += mealTotal;
                    if ($scope.mealPlanNameArray2[i]
                        .mealNutrition !==
                        undefined)
                    {
                        $scope.mealPlanNameArray2[i]
                            .mealNutrition[field] =
                            mealTotal;
                    }
                }
            }
            return GlobalTotal;
        };


        // meal wise nutrition info
        $scope.calcMealNutrientVal = function(index, nutrient, isAdditional, col)
        {
            var total = [];

            if(col===1){
            if ($scope.mealPlanNameArray)
            {
                for (var i = 0; i < $scope.mealPlanNameArray
                    .length; i++)
                {
                    var q = 0;
                    /* add nutrition information of ingredients */
                    for (var j = 0; j < $scope.mealPlanNameArray[
                        i].mealingredient.length; j++)
                    {
                        if (isAdditional && $scope.mealPlanNameArray[
                                i].mealingredient[j]
                            .additionalIngInfo !==
                            undefined)
                        {
                            if ($scope.mealPlanNameArray[
                                    i].mealingredient[
                                    j].additionalIngInfo[
                                    nutrient] !==
                                null)
                            {
                                q += parseFloat(
                                        $scope.mealPlanNameArray[
                                            i].mealingredient[
                                            j].additionalIngInfo[
                                            nutrient
                                        ]) *
                                    parseFloat(
                                        $scope.mealPlanNameArray[
                                            i].mealingredient[
                                            j].quantity
                                    ) * parseFloat(
                                        $scope.mealPlanNameArray[
                                            i].mealingredient[
                                            j].unit
                                        .weight) /
                                    100;
                            }
                            else
                            {
                                q += 0;
                            }
                        }
                        else
                        {
                            q += parseFloat($scope.mealPlanNameArray[
                                    i].mealingredient[
                                    j].ingredient[
                                    nutrient]) *
                                parseFloat($scope.mealPlanNameArray[
                                    i].mealingredient[
                                    j].quantity) *
                                parseFloat($scope.mealPlanNameArray[
                                    i].mealingredient[
                                    j].unit.weight) /
                                100;
                        }
                    }
                    /* add nutrition information of recipes */
                    for (var j = 0; j < $scope.mealPlanNameArray[
                        i].mealrecipe.length; j++)
                    {
                        if (isAdditional && $scope.mealPlanNameArray[
                                i].mealrecipe[j]
                            .additionalRecInfo !==
                            undefined){
                            if ($scope.mealPlanNameArray[
                                    i].mealrecipe[
                                    j].additionalRecInfo[
                                    nutrient] !==
                                null)
                            {
                                q += parseFloat(
                                        $scope.mealPlanNameArray[
                                            i].mealrecipe[
                                            j].additionalRecInfo[
                                            nutrient
                                        ]) *
                                    parseFloat(
                                        $scope.mealPlanNameArray[
                                            i].mealrecipe[
                                            j].servings
                                    );
                            }
                            else
                            {
                                q += 0;
                            }
                        }
                        else{
                            q += parseFloat($scope.mealPlanNameArray[
                                    i].mealrecipe[
                                    j].recipe[
                                    nutrient]) *
                                parseFloat($scope.mealPlanNameArray[
                                    i].mealrecipe[
                                    j].servings);
                        }
                    }
                    total.push(q);
                }
                return total[index];
            }}

            else if(col===2){
            if ($scope.mealPlanNameArray2)
            {
                for (var i = 0; i < $scope.mealPlanNameArray2
                    .length; i++)
                {
                    var q = 0;
                    /* add nutrition information of ingredients */
                    for (var j = 0; j < $scope.mealPlanNameArray2[
                        i].mealingredient.length; j++)
                    {
                        if (isAdditional && $scope.mealPlanNameArray2[
                                i].mealingredient[j]
                            .additionalIngInfo !==
                            undefined)
                        {
                            if ($scope.mealPlanNameArray2[
                                    i].mealingredient[
                                    j].additionalIngInfo[
                                    nutrient] !==
                                null)
                            {
                                q += parseFloat(
                                        $scope.mealPlanNameArray2[
                                            i].mealingredient[
                                            j].additionalIngInfo[
                                            nutrient
                                        ]) *
                                    parseFloat(
                                        $scope.mealPlanNameArray2[
                                            i].mealingredient[
                                            j].quantity
                                    ) * parseFloat(
                                        $scope.mealPlanNameArray2[
                                            i].mealingredient[
                                            j].unit
                                        .weight) /
                                    100;
                            }
                            else
                            {
                                q += 0;
                            }
                        }
                        else
                        {
                            q += parseFloat($scope.mealPlanNameArray2[
                                    i].mealingredient[
                                    j].ingredient[
                                    nutrient]) *
                                parseFloat($scope.mealPlanNameArray2[
                                    i].mealingredient[
                                    j].quantity) *
                                parseFloat($scope.mealPlanNameArray2[
                                    i].mealingredient[
                                    j].unit.weight) /
                                100;
                        }
                    }
                    /* add nutrition information of recipes */
                    for (var j = 0; j < $scope.mealPlanNameArray2[
                        i].mealrecipe.length; j++)
                    {
                        if (isAdditional && $scope.mealPlanNameArray2[
                                i].mealrecipe[j]
                            .additionalRecInfo !==
                            undefined){
                            if ($scope.mealPlanNameArray2[
                                    i].mealrecipe[
                                    j].additionalRecInfo[
                                    nutrient] !==
                                null)
                            {
                                q += parseFloat(
                                        $scope.mealPlanNameArray2[
                                            i].mealrecipe[
                                            j].additionalRecInfo[
                                            nutrient
                                        ]) *
                                    parseFloat(
                                        $scope.mealPlanNameArray2[
                                            i].mealrecipe[
                                            j].servings
                                    );
                            }
                            else
                            {
                                q += 0;
                            }
                        }
                        else{
                            q += parseFloat($scope.mealPlanNameArray2[
                                    i].mealrecipe[
                                    j].recipe[
                                    nutrient]) *
                                parseFloat($scope.mealPlanNameArray2[
                                    i].mealrecipe[
                                    j].servings);
                        }
                    }
                    total.push(q);
                }
                return total[index];
            }}

        };

        $scope.openMealInfoModal = function(index)
        {
            $('#meal-info-modal').openModal();
            $scope.selected = index;
        };

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
                                        $scope.followPlanError = "";
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

        $scope.shortlistPlan = function(planId){
            if(constants.userOb.status){
                /* check authentication */
                var objToSave = {
                    dietplan: planId
                };
                planService.addPlanToShortlist(objToSave)
                    .then(function(
                    response)
                {
                    $scope.saveStatus = "Successfully saved the plan in your saved plans!!"
                   //getUserPlans();
                }, function(error)
                {
                    $scope.saveStatus = "There was an error in saving your plans!!";
                    console.log(error);
                });                        
            }
            else{
                /* prompt user for login */
                $rootScope.$emit('authFailure');
            }
        };
                
    }
]);