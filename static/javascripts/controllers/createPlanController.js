// controller for create plans page
'use strict';

app.controller('createPlanController', ['$scope', 'ingredientService', function($scope, ingredientService) {
  
    $scope.mealEdit = null;
    // function to search ingredients in create plan 
    $scope.mealNameKeys = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
    $scope.mealTrack = [];

    $scope.mealWatch = angular.element("#meals");
    console.log($scope.mealWatch);
    
    $scope.mealPlanNameArray = {Breakfast: [], Lunch: [], Dinner: [], Snacks: []};
    $scope.searchPlan = function(query) {
     if (query) {
           ingredientService.search(query).then(function(response) {
                $scope.details = response;   //model for storing response from API                
    },function(error) {
      console.log(error);
    });
        }
    };
    
    
    $scope.switchMealEdit = function (key) {
        $scope.mealEdit = key;
    };
    $scope.changeKeyName = function (key,oldKey) {
        var temp = $scope.mealNameKeys[oldKey];
        $scope.mealNameKeys[oldKey] = key;
        $scope.mealPlanNameArray[key] = $scope.mealPlanNameArray[temp];
        delete $scope.mealPlanNameArray[oldKey];
        $scope.mealEdit = null;
    }
    
    $scope.$watch('mealWatch', function(newValue, oldValue, scope) {
        console.log("watch");
        var temp = $scope.mealNameKeys.indexOf(oldValue);
        $scope.mealNameKeys[temp] = newValue;
        $scope.mealPlanNameArray[newValue] = $scope.mealPlanNameArray[oldValue];
        delete $scope.mealPlanNameArray[oldValue];
        $scope.mealEdit = null;
        console.log(oldValue, newValue);
        
    });
         
    
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
  
    
    $scope.openCreatePlanModal = function (string) {
        $('#create-plan-modal').openModal();
        console.log(string);
        $scope.currentMealPlanName = string;
    }
    
    $scope.nutrientValue = []; // array to store the nutrient values in modal for every ingredient checked
        
    // copies the ingredients selected in the respective meal array
    $scope.addContents = function () {
        // currentmealPlanname, nutrientvalue
        // these should be used to create a post request  to create meal
        var x = $scope.nutrientValue.slice();
       $scope.mealPlanNameArray[$scope.currentMealPlanName] =  $scope.mealPlanNameArray[$scope.currentMealPlanName].concat(x);
        $scope.nutrientValue.length = 0;
        $('#create-plan-modal').closeModal()
        
    }
   
    // uncheck all the selected items if save button is not clicked
    $scope.emptyModalContents = function () {
        $('#create-plan-modal').closeModal();

    };
    
    
    $scope.amount = 1; // serving per ingredient

    // to fire red(-) button which removes the entire meal

    $scope.clearMeal = function (string) {
        console.log($scope.currentMealPlanName);
        delete $scope.mealPlanNameArray[string];
    }
    
    // adds new mealname
    $scope.addMeal = function (key) {
    alert(key);
       $scope.mealPlanNameArray[key] = [];
        $scope.mealNameKeys.push(key);
    }
    
    $scope.nextDayPlan = function (element) {
        $scope.mealPlanNameArray[element] = [];
    }
    
    // removes ingredients from the modal
    $scope.removeIngredient = function (element) {
         var index = $scope.nutrientValue.indexOf(element);
         $scope.nutrientValue.splice(index, 1);     
     }
     
     // removes ingredients which are saved in meal
     $scope.removeIngredientsFromSavedMeal = function (element) {
         var index = $scope.mealPlanNameArray[$scope.currentMealPlanName].indexOf(element);
         $scope.mealPlanNameArray[$scope.currentMealPlanName].splice(index,1);
     }
     
 
    $scope.dayCount = 1 
    
    $scope.weekCount = 1;
    
    
    
}]);