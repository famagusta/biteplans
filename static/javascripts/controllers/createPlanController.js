'use strict';

app.controller('createPlanController', ['$scope', 'ingredientService', function($scope, ingredientService) {
   
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
    
    $scope.nutrientValue = [];
    
    $scope.nutrientDisplay = [];
        
    $scope.emptyModalContents = function () {
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
        
        $scope.nutrientValue.length = 0;
        
        $('#create-plan-modal').closeModal();

    }
    
    $scope.saveAndContinue = function () {
       
    }
    
    // function to delete ingredients
    $scope.removeIngredient = function (element) {
        var index = $scope.nutrientValue.indexOf(element);
        $scope.nutrientValue.splice(index, 1);     
    }
    
}]);