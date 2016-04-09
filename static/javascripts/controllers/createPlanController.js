// controller for create plans page
'use strict';

app.controller('createPlanController', ['$scope', 'ingredientService', function($scope, ingredientService) {
  
 
    $scope.mealEdit = null;
    // function to search ingredients in create plan 
    $scope.mealPlanNameArray = [{mealname:"Breakfast", ingredient:[], hours:"8", minutes:"00", ampm:"AM"},
                               {mealname:"Lunch", ingredient:[], hours:"1", minutes:"00", ampm:"PM"},
                               {mealname:"Snacks", ingredient:[], hours:"4", minutes:"00", ampm:"PM"},
                               {mealname:"Dinner", ingredient:[], hours:"8", minutes:"00", ampm:"PM"}];
    
    //searches recipes or ingredients
    $scope.searchPlan = function(query) {
     if (query) {
           ingredientService.search(query).then(function(response) {
                $scope.details = response;   //model for storing response from API                
    },function(error) {
      console.log(error);
    });
        }
    };
    
    
    // switch views among differnt steps in creating  plans
    $scope.createPlanView1 = true;
    $scope.createPlanView2 = false;
    $scope.createPlanView3 = false;
    $scope.createPlanView4 = false;

    $scope.switchCreatePlanViews = function (number) {
        if (number === 2 && $scope.createPlanView2!==true) {
               $scope.createPlanView1 = false;
               $scope.createPlanView2 = true;
               $scope.createPlanView3 = false;
               $scope.createPlanView4 = false;
        }
        else if (number === 3 && $scope.createPlanView3!==true) {
               $scope.createPlanView1 = false;
               $scope.createPlanView2 = false;
               $scope.createPlanView3 = true;
               $scope.createPlanView4 = false;
        }
         else if (number === 4 && $scope.createPlanView4!==true) {
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
    }
  
    
    $scope.openCreatePlanModal = function (index) {
        $('#create-plan-modal').openModal();
        $scope.currentMealPlanName = index;
    }
    
    $scope.nutrientValue = []; // array to store the nutrient values in modal for every ingredient checked
        
    // copies the ingredients selected in the respective meal array
    $scope.addContents = function () {
        // currentmealPlanname, nutrientvalue
        // these should be used to create a post request  to create meal
        var x = $scope.nutrientValue.slice();
       $scope.mealPlanNameArray[$scope.currentMealPlanName].ingredient =  $scope.mealPlanNameArray[$scope.currentMealPlanName].ingredient.concat(x);
        $scope.nutrientValue.length = 0;
        $('#create-plan-modal').closeModal();
    }
   
    // uncheck all the selected items if save button is not clicked
    $scope.emptyModalContents = function () {
        $('#create-plan-modal').closeModal();

    };
    
    
    $scope.amount = 1; // serving per ingredient

    // to fire red(-) button which removes the entire meal

    $scope.clearMeal = function (element) {
        $scope.mealPlanNameArray.splice(element,1);
    }
    
    // adds new mealname
    $scope.addMeal = function (key) {
       $scope.mealPlanNameArray.push({mealname:key, ingredient:[], hours: $scope.hours, minutes: $scope.minutes, ampm: $scope.ampm});
       
       $('#add-meal-modal').closeModal();
    }
    
    $scope.triggerAddMealModal = function () {
         $('#add-meal-modal').openModal();
    }
    
    $scope.nextDayPlan = function (element) {
        $scope.mealPlanNameArray[element] = [];
    }
    
    // removes ingredients from the modal
    $scope.removeIngredient = function (element) {
         var index = $scope.nutrientValue.indexOf(element);
         $scope.nutrientValue.splice(index,1);     
     }
     
     // removes ingredients which are saved in meal
     $scope.removeIngredientsFromSavedMeal = function (element) {
        $scope.mealPlanNameArray[$scope.currentMealPlanName].ingredient.splice(element,1);
     }
 
    
}]);


