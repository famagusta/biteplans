'use strict'

/* Angular Controller for summary tab on dashboard. Allows a user to check followed items of a plan */

app.controller('summaryCtrl', ['$scope', 'summaryService', 'searchService',
    function($scope, summaryService, searchService) {
        $scope.plan_data = [];
        $scope.today = moment();
        $scope.navDates = {
            current: moment(),
            next: moment()
                .add(1, "days"),
            prev: moment()
                .subtract(1, "days")
        }
        $scope.navTitles = {
            current: "Today",
            prev: "Yesterday",
            next: "Tomorrow"
        }
        
        /* array to maintain a list of checked ingredients */
        $scope.checklistIngredients = [];
        
        /* watch the array of checked ingredients. if anything changes
           update that particular change */
        $scope.$watchCollection('checklistIngredients', function(newVal,
                oldVal) {
                var diffIncrease = newVal.filter(function(obj) {
                    return !oldVal.some(function(obj2) {
                        return obj === obj2;
                    });
                });
            
                var diffDecrease = oldVal.filter(function(obj) {
                    return !newVal.some(function(obj2) {
                        return obj === obj2;
                    });
                });
                console.log(diffIncrease);
                console.log(diffDecrease);
                if(diffIncrease.length>0){
                    for (var i = 0; i < diffIncrease.length; i++) {                    
                        var id = diffIncrease[i].id;
                        var objToUpdate = {
                            is_checked: true,
                            quantity: diffIncrease[i].quantity
                        };
                        (function(objToUpdate, id) {
                            summaryService.updateEventIngredient(
                                objToUpdate, id);
                        })(objToUpdate, id)
                    }
                }else if(diffDecrease.length > 0){
                    for (var i = 0; i < diffDecrease.length; i++) {                    
                        var id = diffDecrease[i].id;
                        var objToUpdate = {
                            is_checked: false,
                            quantity: diffDecrease[i].quantity
                        };
                        (function(objToUpdate, id) {
                            summaryService.updateEventIngredient(
                                objToUpdate, id);
                        })(objToUpdate, id)
                    }
                }
            })
        
        
        $scope.updateMealIngredientCheck = function(ingredient){
            var id = ingredient.id;
            var objToUpdate = {
                is_checked: ingredient.is_checked
            };
        }
        
        $scope.updateMealIngredientQuantity = function(ingredient){
            var id = ingredient.id;
            var objToUpdate = {
                quantity: ingredient.quantity
            };
            console.log(id);
            console.log(objToUpdate);
            summaryService.updateEventIngredient(objToUpdate, id);
        }
            //function to retrieve a particular days diet plan
        $scope.getDayPlan = function(dateString) {
            summaryService.getUserDayPlan(dateString)
                .then(function(response) {
                    $scope.plan_data = response;
                    for (var i = 0; i < $scope.plan_data.length; i++) {
                        for (var j = 0; j < $scope.plan_data[i]
                            .followingMealPlanIngredient.length; j++
                        ) {
                            $scope.plan_data[i].followingMealPlanIngredient[j].quantity = parseFloat($scope.plan_data[i].followingMealPlanIngredient[j].quantity);
                            console.log("UPDATING > > > ");
                            if ($scope.plan_data[i].followingMealPlanIngredient[
                                j].is_checked) {
                                $scope.checklistIngredients.push(
                                    $scope.plan_data[i].followingMealPlanIngredient[
                                        j]);
                            }
                        }
                    }
                    console.log(response);

                    console.log(response);
                }, function(error) {
                    console.log(error);
                });
        }

        var dateString = $scope.today.format('YYYY-MM-DD');
        $scope.getDayPlan(dateString);


        $scope.getNextDay = function(direction) {
            console.log($scope.navDates);
            if (direction === 1) {
                $scope.navDates.current.add(1, "days");
                $scope.navDates.next.add(1, "days");
                $scope.navDates.prev.add(1, "days");
            }
            else if (direction === -1) {
                $scope.navDates.current.subtract(1, "days");
                $scope.navDates.next.subtract(1, "days");
                $scope.navDates.prev.subtract(1, "days");
            }
            $scope.checkNavTitle();
            $scope.getDayPlan($scope.navDates.current.format(
                'YYYY-MM-DD'));
        }

        /*check whether selected date is same as today, 
    yesterday or tomorrow and set titles accordingly*/
        $scope.checkNavTitle = function() {
            console.log("today : " + $scope.today.format(
                'YYYY-MM-DD'));
            console.log("currdate : " + $scope.navDates.current.format(
                'YYYY-MM-DD'));
            var diff = Math.round($scope.today.diff($scope.navDates
                .current, 'days', true));
            console.log(diff);
            if (diff === 0) {
                $scope.navTitles = {
                    current: "Today",
                    prev: "Yesterday",
                    next: "Tomorrow"
                }
            }
            else if (diff === -1) {
                $scope.navTitles = {
                    current: "Tomorrow",
                    prev: "Today",
                    next: $scope.navDates.next.format(
                        'YYYY-MM-DD')
                }
            }
            else if (diff === 1) {
                $scope.navTitles = {
                    current: "Yesterday",
                    prev: $scope.navDates.prev.format(
                        'YYYY-MM-DD'),
                    next: "Today"
                }
            }
            else if (diff === -2) {
                $scope.navTitles = {
                    current: $scope.navDates.current.format(
                        'YYYY-MM-DD'),
                    prev: "Tomrrow",
                    next: $scope.navDates.next.format(
                        'YYYY-MM-DD')
                }
            }
            else if (diff === 2) {
                $scope.navTitles = {
                    current: $scope.navDates.current.format(
                        'YYYY-MM-DD'),
                    prev: $scope.navDates.prev.format(
                        'YYYY-MM-DD'),
                    next: "Yesterday"
                }
            }
            else {
                $scope.navTitles = {
                    current: $scope.navDates.current.format(
                        'YYYY-MM-DD'),
                    prev: $scope.navDates.prev.format(
                        'YYYY-MM-DD'),
                    next: $scope.navDates.next.format(
                        'YYYY-MM-DD')
                }
            }
        }

        
        //opens modal to add ingredients/recipes on a current mealplan
        $scope.openCreatePlanModal = function(index) {
            $('#add-food-modal')
                .openModal();
            $scope.currentMealPlanName = index;
        };

        // Add Hours and Minutes for a meal time
        $scope.addMealHours = [];
        // WHAT DOES THIS LOOP DO?
        for (var i = 0; i <= 23; i++) {
            $scope.addMealHours.push(i);
        }

        $scope.addMealMinutes = [];

        for (var j = 0; j <= 59; j++) {
            $scope.addMealMinutes.push(j);
        }

        // adds new mealname
        $scope.addMeal = function(key) {
            key.day = $scope.navDates.current;
            var tm = key.time;
            key.time = key.time.getHours() + ":" +
                key.time.getMinutes() + ":00";
            

            $('#add-meal-modal')
                .closeModal();
        };


    }
]);