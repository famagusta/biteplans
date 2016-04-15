'use strict';

app.controller('createRecipeController', ['$scope', 'ingredientService','recipeService', function($scope, ingredientService, recipeService) {
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
        for(var i=$scope.ingredientDisplay.length; i<$scope.nutrientValue.length; i++){
          $scope.ingredientDisplay.push({ingredient:$scope.nutrientValue[i].id, measure: $scope.nutrientValue[i].measure[0].id});
        }
        console.log($scope.ingredientDisplay);
        $('#create-recipe-modal').closeModal();
     };
     
     $scope.stepsToCreateRecipes = [''];
    
     $scope.addMoreSteps = function (item) {
         $scope.stepsToCreateRecipes.length += 1;
     };
    
     $scope.currentPage = 1;
  $scope.pageSize = 6; 

     var createRecipe = function(recipe){
      console.log(recipe);
      recipeService.createRecipe(recipe).then(function(response){

          var id = response.recipe_id;
          console.log(id);
          for(var i=0; i<$scope.ingredientDisplay.length; i++){
                $scope.ingredientDisplay[i].recipe = id;
                recipeService.createRecipeIng($scope.ingredientDisplay[i]).then(function(response){
                      console.log(response);
                    },
                    function(error){
                              console.log(error);
                    });

            };


      }, function(error){

        console.log('recipe could not be created, try again later');

      })

     };

     var createRecipeIngredient = function(){

     };

     $scope.finalizeRecipeCreation = function(){
       $scope.recipe.directions = '';
       for(var i=0; i< $scope.stepsToCreateRecipes.length; i++)
       {$scope.recipe.directions = $scope.recipe.directions + ' ' + $scope.stepsToCreateRecipes[i];}

       $scope.recipe.prep_time= $scope.prep_hours + ':' +$scope.prep_mins + ':00';
       $scope.recipe.cook_time= $scope.cook_hours + ':' +$scope.cook_mins + ':00';

       createRecipe($scope.recipe);
     };
         
        
}]);