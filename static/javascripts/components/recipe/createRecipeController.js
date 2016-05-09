'use strict';

app.controller('createRecipeController', ['$scope', 'AuthService',
    '$routeParams', 'constants',
    'searchService', '$location', 'recipeService',
    function($scope, AuthService, $routeParams, constants, searchService,
        $location,
        recipeService) {

        AuthService.isAuthenticated()
            .then(function(response) {
                var isAuthenticated = response.status;
                if (isAuthenticated) {

                    /* initialize scope variables to interact with DOM */

                    // stores the entries from the checkbox prior to saving into
                    // recipe ingredients
                    $scope.checklistIngredients = [];

                    // stores the ingredients added to the recipe so far
                    $scope.ingredientDisplay = [];

                    //stores the last ingredient added to the recipe
                    $scope.lastChecked = null;
                    $scope.AdditionalIngredientInfo = [];
                    //variables to gather additional information
                    $scope.prepHours = 0;
                    $scope.prepMins = 0;
                    $scope.cookHours = 0;
                    $scope.cookMins = 0;
                    $scope.recipe = {}
                    
                    // route to navigate to view the recipe after creation
                    $scope.view_recipe = '/viewRecipe/' +
                        $routeParams.id;
                    
                    /* variables & functions to upload image file for recipe */
                    $scope.formdata = new FormData();
                    $scope.getTheFiles = function ($files) {
                            angular.forEach($files, function (value, key) {
                                $scope.formdata.append('file', value);                                
                            });
                        
                    };
                    
                    $scope.uploadFile = function(id){
                        var file = $scope.recipe_image_file;
                        var url = constants.API_SERVER + 'biteplans/recipe/recipes/' 
                        + id + '/';
                        if(file){
                            console.log(file);
                            recipeService.uploadRecipeImage(file, url);
                        }
                    };
                    
                    
                     /* Nutritional Information calculations based on changes to
                        selected ingredients */
                    $scope.calculateNutritionTotal = function(nutrient){
                        var total=0;
                        var servings = parseInt($scope.recipe.servings);
                        //prevent divide by zero
                        if (!servings){
                            servings = 1;
                        }
                        for (var i=0; i< $scope.ingredientDisplay.length; i++){
                            total += parseFloat($scope.ingredientDisplay[i].ingredient[nutrient])
                                * parseFloat($scope.ingredientDisplay[i].quantity)
                                * parseFloat($scope.ingredientDisplay[i].selected_measure.weight)
                                / (100 * servings);
                            console.log($scope.ingredientDisplay[i]);
                        }
                        return total;
                    }
                    /* calculates additional nutritional information */
                    $scope.calculateAddtnlNutritionTotal = function(nutrient){
                        var total=0;
                        var servings = parseInt($scope.recipe.servings);
                        //prevent divide by 0
                        if (!servings){
                            servings = 1;
                        }
                        for (var i=0; i< $scope.AdditionalIngredientInfo.length; i++){
                            total += parseFloat($scope.AdditionalIngredientInfo[i][nutrient] )
                                    * parseFloat($scope.ingredientDisplay[i].quantity)
                                    * parseFloat($scope.ingredientDisplay[i].selected_measure.weight) 
                                    / (100 * servings)
                        }
                        return total;
                    }
                    
                    
                    /* search function for the ingredient modal */
                    $scope.search = function() {
                        var query = $scope.query;
                        if (query) {
                            searchService.search_ingredient(
                                    query)
                                .then(
                                    function(response) {
                                        /* model for storing response from API */
                                        $scope.details =
                                            response;
                                    }, function(error) {
                                        // TODO : Handle error cases better
                                        console.log(error);
                                    });
                        }
                    };

                    /* function that opens the modal */
                    // is create recipe a modal anymore??
                    $scope.addRecipeIngredModal = function() {
                        $scope.lastChecked = null;
                        $('#add-ingredients-modal')
                            .openModal();
                    };

                    /* watch the value of nutrient value to detect change 
                      and update the last checked value */
                    $scope.$watch('checklistIngredients', function(
                        newVal, oldVal) {
                        if (newVal.length > 0) {
                            $scope.lastChecked = newVal[
                                newVal.length - 1];
                        }
                    }, true);

                    /* function to remove an ingredient from the recipe */
                    $scope.removeIngredient = function(element) {
                        // remove ingredient from checklist array
                        var index = $scope.checklistIngredients.filter(function(el) {
                            return el.id === element; // Filter out the appropriate one
                        })
                        $scope.checklistIngredients.splice(
                            index, 1);

                        // remove ingredient from recipe ingredients

                        $scope.ingredientDisplay.splice(index,
                            1);
                        
                        // remove ingredient from recipe ingredients
                        $scope.AdditionalIngredientInfo.splice(index,
                            1);
                    };


                    /* add contents from the modal to the recipe */
                    $scope.addContents = function() {
                        /*loop over the checklist mode (nutrient value) and
                          add to the ingredients 
                          also, add the weight of each ingredient measure to 
                          use in calculating total nutrient*/
                        for (var i = $scope.ingredientDisplay.length; i <
                            $scope.checklistIngredients.length; i++
                        ) {
                            // call API to get addtional ingredient information
                                    
                            searchService.get_ingredient_addtnl_info($scope
                                                                 .checklistIngredients[i]
                                                                 .id)
                            .then(function(response) {
                                //model for storing response from API                
                                $scope.AdditionalIngredientInfo.push(response); 
                            }, function(error) {
                                console.log(error);
                            });
                            
                            
                            $scope.ingredientDisplay.push({
                                ingredient: $scope.checklistIngredients[
                                    i],
                                selected_measure: $scope
                                    .checklistIngredients[
                                        i].measure[0],
                                quantity: 1,
                            });
                        }
                        
                        $('#add-ingredients-modal')
                            .closeModal();

                        /* cleanup checklist and search results */
                        $scope.lastChecked = null;
                        $scope.details = [];
                        
                    };

                    $scope.stepsToCreateRecipes = [''];
                    $scope.addMoreSteps = function() {
                        $scope.stepsToCreateRecipes.length += 1;
                    };

                    $scope.currentPage = 1;
                    $scope.pageSize = 6;
                    var createRecipe = function(recipe) {
                        recipeService.createRecipe(recipe)
                            .then(
                                function(response) {
                                    var id = response.recipe_id;
                                    
                                    for (var i = 0; i < $scope.ingredientDisplay
                                        .length; i++) {
                                        /* create a recipe ingred object to send to server */
                                        var recipeIngred ={
                                            recipe: id,
                                            ingredient: $scope.ingredientDisplay[i].ingredient
                                            .id,
                                            measure: $scope.ingredientDisplay[i]
                                            .selected_measure.id,
                                            quantity: $scope.ingredientDisplay[i].quantity
                                        } 
                                        
                                        recipeService.createRecipeIng(recipeIngred)
                                            .then(
                                                function(
                                                    response) {
                                                    //TODO: Add meaningful behaviour
                                                    //    on successful return
                                                }, function(
                                                    error) {
                                                    console.log(
                                                        error
                                                    );
                                                });
                                        
                                        /* upload image file to server upon id creation 
                                           Note: it was easier to do this separately since
                                           the other option was to rewrite sending data in 
                                           a form as opposed to urlencoding it */
                                        $scope.uploadFile(id);
                                    }

                                    /* Redirect to view recipe page */
                                    $location.path(
                                        '/viewRecipe/' + id
                                    );
                                }, function(error) {
                                    console.log(
                                        'recipe could not be created, try again later',
                                        error);
                                });
                    };

                

                    /* function called for saving the plan */
                    $scope.finalizeRecipeCreation = function($files) {
                        $scope.recipe.directions = '';
                        for (var i = 0; i < $scope.stepsToCreateRecipes
                            .length; i++) {
                            $scope.recipe.directions = $scope.recipe
                                .directions + ' \n' + $scope.stepsToCreateRecipes[
                                    i];
                        }
                        $scope.recipe.prep_time = $scope.prepHours +
                            ':' + $scope.prepMins + ':00';
                        $scope.recipe.cook_time = $scope.cookHours +
                            ':' + $scope.cookMins + ':00';
                        createRecipe($scope.recipe);
                    };

                    
                }
                else {
                    $location.path('/');
                }
            }, function(error) {
                $location.path('/');
                console.log(error);
            });
    }
]);