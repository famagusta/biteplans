// controller for create plans page
'use strict';

app.controller('createPlanController', ['$scope','$window','AuthService', '$routeParams', 'ingredientService', '$location', 'planService', function($scope, $window, AuthService, $routeParams, ingredientService, $location, planService) {
    

    
  AuthService.isAuthenticated().then(function(response){
    var isAuth = response.status;
    //page is visible only if user is authenticated
    if(isAuth){
    //if authed then create these objects

    $scope.plan = {}; //object to create/update dietplan
    //stores the details to get current day plan
    $scope.dayplan = {'day_no':1, 'week_no':1};
    $scope.unit =0; //unit for height
    
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
    //week count for current plan
    $scope.weekCount = [];

    //day count for current plan
    $scope.dayCount = [];

    //phase of the day
    $scope.amPmArray = ["AM", "PM"];

    //urls for previous and next buttons

    $scope.backUrl3 = '/plan2/'+$routeParams.id;
    $scope.backUrl2 = '/plan/'+$routeParams.id;
    $scope.nextUrl2 = '/plan3/'+$routeParams.id;

    //function to create dietplan from page1
    
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
    
    $scope.addMealHours = [];
    
    for(var i = 0 ; i <= 23 ; i++) {
        $scope.addMealHours.push(i);
    }
    
     $scope.addMealMinutes = [];
    
    for(var j = 0 ; j <= 59 ; j++) {
        $scope.addMealMinutes.push(j);
    }

    
        
    $scope.mealEdit = null;


    $scope.updateDayMealPlan = function(index){

         var obj = {
            'name':$scope.mealPlanNameArray[index].mealname,
            'time':$scope.mealPlanNameArray[index].time.getHours()+':'+$scope.mealPlanNameArray[index].time.getMinutes()
                
            };

            planService.updateMealPlan(obj, $scope.mealPlanNameArray[index].id).then(function(response){
                console.log(response);

            }, function(error){

                console.log(error);

            });};

    $scope.updateMealIngredient = function(obj){
        console.log(obj);

         var obje = {
            'quantity':obj.quantity,
            'ingredient':obj.ingredient.id,
            'unit':obj.unit.id           
                
            };

            planService.updateMealIngredient(obje, obj.id).then(function(response){
                console.log(response);

            }, function(error){

                console.log(error);

            });
        

      
    };

    
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
        
    //opens modal to add ingredients/recipes on a current mealplan
    $scope.openCreatePlanModal = function (index) {
        $('#create-plan-modal').openModal();
        $scope.currentMealPlanName = index;
    };
    
    $scope.nutrientValue = []; // array to store the nutrient values in modal for every ingredient checked
        
    // copies the ingredients selected in the respective meal array
    $scope.addContents = function () {
        // currentmealPlanname, nutrientvalue
        // these should be used to create a post request  to create meal
        var currlength = $scope.mealPlanNameArray[$scope.currentMealPlanName].mealingredient.length
        var x = $scope.nutrientValue.slice();
        for(var i=0; i<x.length; i++){
            if (x[i].measure.length!==0) {
                 $scope.mealPlanNameArray[$scope.currentMealPlanName].mealingredient.push({ingredient:x[i], unit:x[i].measure[0], quantity:1})
            }
            else {
                 $scope.mealPlanNameArray[$scope.currentMealPlanName].mealingredient.push({ingredient:x[i], unit:x[i].measure, quantity:1});
            }
           
        }
        //post ingredients to db via url endpoint
        $scope.fillMealPlan(currlength, $scope.currentMealPlanName);
        $scope.nutrientValue.length = 0;
        $('#create-plan-modal').closeModal();
        
    };
    
   
    // uncheck all the selected items if save button is not clicked
    $scope.emptyModalContents = function () {
        $('#create-plan-modal').closeModal();

    };

    //function to disable search result checkboxes which have already been selected
    $scope.checkToDisable = function(index){
        for(var k=0; k < $scope.mealPlanNameArray[$scope.currentMealPlanName].mealingredient.length; k++){
            if($scope.mealPlanNameArray[$scope.currentMealPlanName].mealingredient[k].ingredient.id===index)
            {
                return true;
            }
        }
        return false;
    };
    
    
    $scope.amount = 1; // serving per ingredient

    // to fire red(-) button which removes the entire meal

    $scope.clearMeal = function (element) {
        $scope.mealPlanNameArray.splice(element,1);
    };
    
    // adds new mealname
    $scope.addMeal = function (key) {
       $scope.mealPlanNameArray.push({mealname:key, ingredient:[], hours: $scope.hours, minutes: $scope.minutes, ampm: $scope.ampm});
       
       $('#add-meal-modal').closeModal();
    };
    
    $scope.triggerAddMealModal = function () {
         $('#add-meal-modal').openModal();
    };
    
    $scope.nextDayPlan = function (element) {
        $scope.mealPlanNameArray[element] = [];
    };
    
    // removes ingredients from the modal
    $scope.removeIngredient = function (element) {
         var index = $scope.nutrientValue.indexOf(element);
         $scope.nutrientValue.splice(index,1);     
     };
     
     // removes ingredients which are saved in meal
     $scope.removeIngredientsFromSavedMeal = function (element) {
        $scope.mealPlanNameArray[$scope.currentMealPlanName].ingredient.splice(element,1);
     };
     
     $scope.calculateTotalInfo = function (index, field) {
          
         console.log($scope.mealPlanNameArray[index]);
            var total =0;
        for(i=0;i<$scope.mealPlanNameArray[index].ingredient.length;i++) {
           
           total += parseFloat($scope.mealPlanNameArray[index].ingredient[i].ingredient[field]);  
       } 
         return total;
         
     };

     //function to get current dayplan details including all meals and mealings
     $scope.getDayPlan = function(){
        var id = $routeParams.id;
        planService.getdayplan(id, $scope.dayplan.day_no, $scope.dayplan.week_no).then(function(response){
            console.log(response);
            for(var i=0; i<response.mealplan.length; i++){
                response.mealplan[i].mealname = response.mealplan[i].name;
                delete response.mealplan[i].name;
                var dateStr = "July 21, 1983 " + response.mealplan[i].time;
                var b = new Date(dateStr);
                response.mealplan[i].time = b;
            }

            $scope.mealPlanNameArray = response.mealplan;
            console.log($scope.mealPlanNameArray);

        },function(response){
            console.log(response);

        });



     };


     //get initial data for day1 and week 1 of the plan
     $scope.getDayPlan();
    
     //function to create meal ingredients related to given mealplan
     $scope.fillMealPlan = function(ind, current){

        var temp = $scope.mealPlanNameArray[current].mealingredient;
        for(var i=ind; i<temp.length; i++){


            var saveind = i;
                    

            var obj = {
                'ingredient':temp[i].ingredient.id,   
                'meal_plan':$scope.mealPlanNameArray[current].id,
                'quantity':temp[i].quantity,
                'unit':temp[i].unit.id
            };
            console.log(temp[i].unit);

            planService.createMealIngredient(obj).then(function(response){
                console.log(i, temp);
                $scope.mealPlanNameArray[current].mealingredient[saveind].id=response.meal_ingredient_id;
                console.log($scope.mealPlanNameArray[current].mealingredient);

            }, function(error){

                console.log(error);

            });





        }
        
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