// controller for create plans page
'use strict';

app.controller('createPlanController', ['$scope','$window','AuthService', '$routeParams', 'ingredientService', '$location', 'planService', function($scope, $window, AuthService, $routeParams, ingredientService, $location, planService) {
    

    
  AuthService.isAuthenticated().then(function(response){
    var isAuth = response.status;
    if(isAuth){
    $scope.plan = {};
    
    $scope.unit =0;
    
    $scope.displayHeight = function (string) {
        
        if (string === 0) {
            $scope.feet = 1;
            $scope.inches = 0;
            $scope.unit= string;
        }
        else   {
            $scope.metric = 1;
            $scope.unit=string;
        }  
    };
    
    $scope.weekCount = [];
    $scope.dayCount = [];
    $scope.amPmArray = ["AM", "PM"];

    $scope.backUrl3 = '/plan2/'+$routeParams.id;
    $scope.backUrl2 = '/plan/'+$routeParams.id;
     $scope.nextUrl2 = '/plan3/'+$routeParams.id;
    
    $scope.func = function () {
        for(var i = 1 ; i <= $scope.plan.duration ; i++) {
            $scope.weekCount.push('Week' + '' + i);
        }
        for(var j = 1 ; j <= 7 ; j++) {
                $scope.dayCount.push('Day' + '' + j);  
        }
        $window.localStorage.setItem('weekCount', $scope.weekCount);
        $window.localStorage.setItem('dayCount', $scope.dayCount);

        console.log($scope.plan);
        var id = $routeParams.id;
        console.log(id);
        planService.updatePlan($scope.plan, id).then(function(response){
            console.log(response);
            $location.path('/plan2/'+response.id);

        }, function(error){
            console.log(error);
        });

    };
    $scope.weekCount.length = 0;
    
     $scope.addMealHours = [];
    
    for(var i = 0 ; i <= 23 ; i++) {
        $scope.addMealHours.push(i);
    }
    
     $scope.addMealMinutes = [];
    
    for(var j = 0 ; j <= 59 ; j++) {
        $scope.addMealMinutes.push(j);
    }

    
        
    $scope.mealEdit = null;
    // function to search ingredients in create plan 


    $scope.mealPlanNameArray = [{mealname:'Breakfast', ingredient:[], hours:'8', minutes:'00', ampm:'AM'},
                               {mealname:'Lunch', ingredient:[], hours:'1', minutes:'00', ampm:'PM'},
                               {mealname:'Snacks', ingredient:[], hours:'4', minutes:'00', ampm:'PM'},
                               {mealname:'Dinner', ingredient:[], hours:'8', minutes:'00', ampm:'PM'}];




    
    //searches recipes or ingredients
    $scope.searchPlan = function(query) {
     if (query) {
           ingredientService.search(query).then(function(response) {
                $scope.details = response;   //model for storing response from API 
               console.log($scope.details);
    },function(error) {
      console.log(error);
    });
        }
    };
        
    
    $scope.openCreatePlanModal = function (index) {
        $('#create-plan-modal').openModal();
        $scope.currentMealPlanName = index;
    };
    
    $scope.nutrientValue = []; // array to store the nutrient values in modal for every ingredient checked
        
    // copies the ingredients selected in the respective meal array
    $scope.addContents = function () {
        // currentmealPlanname, nutrientvalue
        // these should be used to create a post request  to create meal
        var x = $scope.nutrientValue.slice();
        for(var i=0; i<x.length; i++){
            if (x[i].measure.length!==0) {
                 $scope.mealPlanNameArray[$scope.currentMealPlanName].ingredient.push({ingredient:x[i], unit:x[i].measure[0].id, quantity:1})
            }
            else {
                 $scope.mealPlanNameArray[$scope.currentMealPlanName].ingredient.push({ingredient:x[i], unit:x[i].measure, quantity:1})
            }
            
           
        }
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
     
     $scope.calculateTotalInfo = function (index, field) {
          
         console.log($scope.mealPlanNameArray[index]);
            var total =0;
        for(i=0;i<$scope.mealPlanNameArray[index].ingredient.length;i++) {
           
           total += parseFloat($scope.mealPlanNameArray[index].ingredient[i].ingredient[field]);  
       } 
         return total;
         
     };
 }

 else{
    $location.path('/');
 }
 }, function(error){
    console.log(error);
    $location.path('/');
 } ); 
    
    
    
 
    
}]);
    // $scope.submitted = false;


    // var validateInput = function (input) {
    //     if (input) {
    //         return true;
    //     }
        
    //     return false;
    // }
    
    // // Create plan form validation
    // $scope.submitForm = function () {
    //     var planName = $scope.plan.plan_name_test;
    //     var planDuration = $scope.plan.durations;
    //     var planWeight = $scope.plan.plan_weight;
    //     var planAge = $scope.plan.age;
    //     var planFeet = $scope.plan.feet;
    //     var planInches = $scope.plan.inches;
        
    //     if ($scope.unit == 0) {
    //         var planHeightInCms = parseFloat(($scope.plan.feet)*30.48+($scope.plan.inches)*2.54)
    //         console.log(planHeightInCms);
    //     }
    //     else {
    //        var planHeightInCms = $scope.plan.metric;
    //         console.log(planHeightInCms);
    //     }
        
    //     var testValidate = [planName, planDuration, planWeight, planAge];
        
    //     $scope.errorArray = ['','','',''];
    //     var output =testValidate.map(validateInput); 
    //     var allOutputValid = output.every(function(element) {
    //         return element === true;
    //     });
       
    //     if(allOutputValid){
    //         $scope.switchCreatePlanViews(2);
    //     }else{
    //         for (var i=0;i<output.length;i++) {
    //             if (output[i]==false) {
    //                 $scope.errorArray[i] = 'Required';
    //             }
 
    //         }
    //     }

    // }