'use strict';

app.controller('createRecipeController', ['$scope', 'ingredientService', function($scope, ingredientService) {
      $scope.search = function() {
          console.log('dkjdh');
          var query = $scope.query;
          console.log(query);
            if (query) {
                ingredientService.search(query).then(function(response) {
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
    }
     
     $scope.emptyModalContents = function () {
        $('#create-recipe-modal').closeModal();
    }
     
      $scope.nutrientValue = [];
      $scope.ingredientDisplay = [];
    
    $scope.removeIngredient = function (element) {
         var index = $scope.nutrientValue.indexOf(element);
         $scope.nutrientValue.splice(index, 1);     
     }
    
     $scope.addContents = function () {
        $scope.ingredientDisplay = $scope.nutrientValue.slice(0);
        $('#create-recipe-modal').closeModal();
     }
     
     $scope.stepsToCreateRecipes = ['Step1', 'Step2'];
    
     $scope.addMoreSteps = function (item) {
         $scope.stepsToCreateRecipes.push(item);
     }
         
        
}]);