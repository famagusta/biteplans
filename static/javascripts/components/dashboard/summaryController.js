'use strict'

/* Angular Controller for summary tab on dashboard. Allows a user to check followed items of a plan */

app.controller('summaryCtrl', ['$scope',function ($scope){
    // below is some random day plan for the user 
    $scope.plan_data = [
            {
             title: 'Breakfast',
             ingredient: [
                 {name: ["Egg", 1, "large"]},
                 {name: ["butter", 0.5, "stick"]},
             ],
             hours:"8",
             minutes:"00",
             ampm:"AM"
            },
            {
             title: 'Lunch',
             ingredient: [
                 {name: ["Egg", 1, "large"]},
                 {name: ["butter", 0.5, "stick"]},
             ],
             hours:"1",
             minutes:"00",
             ampm:"PM"
            },
            {
             title: 'Dinner',
             ingredient: [
                 {name: ["Egg", 1, "large"]},
                 {name: ["butter", 0.5, "stick"]},
             ],
             hours:"8",
             minutes:"00",
             ampm:"PM"    
            },
            {
            title: 'Snacks',
             ingredient: [
                 {name: ["Egg", 1, "large"]},
                 {name: ["butter", 0.5, "stick"]},
             ],
             hours:"6",
             minutes:"00",
             ampm:"PM"    
            }]
    
    
    
}]);