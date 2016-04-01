// controller for create plans page
'use strict';

app.controller('createPlanController', ['$scope', 'ingredientService', function($scope, ingredientService) {
  
   
    // function to search ingredients in create plan modal
    $scope.searchPlan = function(query) {
     if (query) {
           ingredientService.search(query).then(function(response) {
                $scope.details = response;   //model for storing response from API                
                console.log($scope.details);                          
    },function(error) {
      console.log(error);
    });
        }
    }
         
    
    // switch views among differnt steps in creating  plans
    $scope.createPlanView1 = true;
    $scope.createPlanView2 = false;
    $scope.createPlanView3 = false;
    $scope.createPlanView4 = false;

    $scope.switchCreatePlanViews = function (number) {
        if (number == 2 && $scope.createPlanView2!==true) {
               $scope.createPlanView1 = false;
               $scope.createPlanView2 = true;
               $scope.createPlanView3 = false;
               $scope.createPlanView4 = false;
        }
        else if (number == 3 && $scope.createPlanView3!==true) {
               $scope.createPlanView1 = false;
               $scope.createPlanView2 = false;
               $scope.createPlanView3 = true;
               $scope.createPlanView4 = false;
        }
         else if (number == 4 && $scope.createPlanView4!==true) {
               $scope.createPlanView1 = false;
               $scope.createPlanView2 = false;
               $scope.createPlanView3 = false;
               $scope.createPlanView4 = true;
        }
        else {
               $scope.createPlanView1 = true;
               $scope.createPlanView2 = false;
               $scope.createPlanView3 = false;
               $scope.createPlanView4 = false;
        }
    };
    
    $scope.openCreatePlanModal = function (digit) {
        $('#create-plan-modal').openModal();
        if (digit == 1) {
            $scope.mealName = 'Breakfast';
        }
        else if (digit == 2) {
            $scope.mealName = 'Lunch'; 
        }
        else if (digit == 3) {
            $scope.mealName = 'Dinner';
        }
        else if (digit == 4) {
            $scope.mealName = 'Snacks';
        }
        
    }
    
    $scope.nutrientValue = []; // array to store the nutrient values in modal for every ingredient checked
    
    // separate array for each meal
    $scope.breakfastDisplay = [];
    $scope.lunchDisplay = [];
    $scope.dinnerDisplay = [];
    $scope.snacksDisplay = [];
    
    // copies the ingredients selected in the respective meal array
    $scope.addContents = function () {
         if ($scope.mealName == 'Breakfast') {
            $scope.breakfastDisplay = $scope.nutrientValue.slice(0);
        }
         if ($scope.mealName == 'Lunch') {
            $scope.lunchDisplay = $scope.nutrientValue.slice(0);
        }
         if ($scope.mealName == 'Dinner') {
            $scope.dinnerDisplay = $scope.nutrientValue.slice(0);
        }
         if ($scope.mealName == 'Snacks') {
            $scope.snacksDisplay = $scope.nutrientValue.slice(0);
        }
        
        $('#create-plan-modal').closeModal();
    }
   
    // uncheck all the selected items if save button is not clicked
    $scope.emptyModalContents = function () {
       
        $scope.breakfastDisplay.length = 0;
        $scope.lunchDisplay.length = 0;
        $scope.dinnerDisplay.length = 0;
        $scope.snacksDisplay.length = 0;
        
        $('#create-plan-modal').closeModal();

    }
    
    
    $scope.amount = 1; // serving per ingredient

    // to fire red(-) button which removes the entire meal
    $scope.clearMeal = function () {
       if ($scope.mealName == 'Breakfast') {
            $scope.breakfastDisplay.length = 0;
        }
         if ($scope.mealName == 'Lunch') {
            $scope.lunchDisplay.length = 0;
        }
         if ($scope.mealName == 'Dinner') {
            $scope.dinnerDisplay.length = 0;
        }
         if ($scope.mealName == 'Snacks') {
            $scope.snacksDisplay.length = 0;
        }
    }
    
    // function to delete ingredients from modal
    $scope.removeIngredient = function (element) {
        var index = $scope.nutrientValue.indexOf(element);
        $scope.nutrientValue.splice(index, 1);     
    }
    
    // function to delete meal from the saved ingredients
    $scope.removeSavedIngredient = function (num) {
        if (num == 1) {
           var index = $scope.breakfastDisplay.indexOf(num);
           $scope.breakfastDisplay.splice(index, 1); 
        }
        if (num == 2) {
           var index = $scope.lunchDisplay.indexOf(num);
           $scope.lunchDisplay.splice(index, 1); 
        }
        if (num == 3) {
           var index = $scope.dinnerDisplay.indexOf(num);
           $scope.dinnerDisplay.splice(index, 1); 
        }
        if (num == 4) {
           var index = $scope.snacksDisplay.indexOf(num);
           $scope.snacksDisplay.splice(index, 1); 
        }
        
    }
    
    $scope.dayCount = 1 
    
    $scope.weekCount = 1;
    
    $scope.addMealName = {};
    
    $scope.addMealName.meal1 = 'Breakfast';
    $scope.addMealName.meal2 = 'Lunch';
    $scope.addMealName.meal3 = 'Dinner';
    $scope.addMealName.meal4 = 'Snacks';
    
    
}]);