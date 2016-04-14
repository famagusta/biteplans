'use strict';

app.controller('createRecipeController', ['$scope', 'ingredientService', function($scope, ingredientService) {
      $scope.search = function() {
          var query = $scope.query;
            if (query) {
                ingredientService.search(query).then(
                                  function(response) {
                                          $scope.details = response;   //model for storing response from API                
                                          console.log($scope.details);                          
                                          },function(error) {
                                                console.log(error);
                                              });
                                          }
                                      };

     $scope.openCreateRecipeModal = function (string) {
        $('#create-recipe-modal').openModal();
        console.log(string);
        $scope.currentMealPlanName = string;
    };
     
     
      $scope.nutrientValue = [];
      $scope.ingredientDisplay = [];
    
    $scope.removeIngredient = function (element) {
         var index = $scope.nutrientValue.indexOf(element);
         $scope.nutrientValue.splice(index, 1);     
     };
    
    $scope.removeIngredientsFromSavedMeal = function (element) {
        $scope.ingredientDisplay.splice(element,1);
    }
    
     $scope.addContents = function () {
        for(var i=0; i<$scope.nutrientValue.length; i++){
          $scope.ingredientDisplay.push({ingredient:$scope.nutrientValue[i].id});
        }
        console.log($scope.ingredientDisplay);
        $('#create-recipe-modal').closeModal();
     };
     
     $scope.stepsToCreateRecipes = ['Step1', 'Step2'];
    
     $scope.addMoreSteps = function (item) {
         $scope.stepsToCreateRecipes.push(item);
     };
    
     $scope.currentPage = 1;
  $scope.pageSize = 6; 

     var createRecipe = function(){

     };

     var createRecipeIngredient = function(){

     };

     $scope.finalizeRecipeCreation = function(){

        console.log($scope.ingredientDisplay);

     };
         
        
}]);