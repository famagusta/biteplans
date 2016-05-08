'use strict';

app.controller('createRecipeController', ['$scope', 'AuthService',
    '$routeParams',
    'searchService', '$location', 'recipeService',
    function($scope, AuthService, $routeParams, searchService,
        $location,
        recipeService) {

        AuthService.isAuthenticated()
            .then(function(response) {
                var isAuthenticated = response.status;
                console.log(response);
                if (isAuthenticated) {

                    /* initialize scope variables to interact with DOM */

                    // stores the entries from the checkbox prior to saving into
                    // recipe ingredients

                    //This is to store the checked results from the given search page
                    $scope.checklistIngs = [];

                    //this is to store all the checked/selected results
                    $scope.checklistIngredients = [];

                    // stores the ingredients added to the recipe so far
                    $scope.ingredientDisplay = [];

                    //stores the last ingredient added to the recipe
                    $scope.lastChecked = null;

                    //variables to gather additional information
                    $scope.prep_hours = 0;
                    $scope.prep_mins = 0;
                    $scope.cook_hours = 0;
                    $scope.cook_mins = 0;

                    // route to navigate to view the recipe after creation
                    $scope.view_recipe = '/viewRecipe/' +
                        $routeParams.id;

                    /* search function for the ingredient modal */
                    $scope.foodgroup=[];


                    //Checks for applied filters, as soon as a new filter is applied or removed
                    //search result is changed.

                    $scope.$watchCollection('foodgroup', function (newVal, oldVal) {

                        $scope.search(1, $scope.sortby);


                     });

                    //main search fn, executed on page change(page specifies page number to be displayed)
                    //checks whether applied sort order is same as previous sort order or not, 
                    //if not, then only make the request, if the order is same and filters are same,
                    //then do not make the request.
                    $scope.search = function(page, sortby) {
                        $scope.details = undefined;
                        if($scope.query!==undefined){

                        $scope.sortby = sortby;
                        $scope.checklistIngredients = $scope.checklistIngredients.concat(
                                                        $scope.checklistIngs.splice(0,$scope.checklistIngs.length
                                                        ));
                        
                        var query = $scope.query;
                        console.log(query, page, sortby);
                        if (query !==undefined && $scope.foodgroup.length >0) {
                            searchService.search_ingredient(query, page, $scope.foodgroup, sortby)
                                .then(function(response) {
                                    $scope.details = response;
                                    $scope.filts = response.filters; //model for storing response from API                
                                    console.log($scope.details);
                                    // pagination
                                    $scope.currentPage = page;
                                    $scope.pageSize = response.total*6;
                                }, function(error) {
                                    console.log(error);
                                });
                        }
                        else if (query != undefined && $scope.foodgroup.length ===0) {
                            searchService.search_ingredient(query, page, null, sortby)
                                .then(function(response) {
                                    $scope.details = response;
                                    $scope.filts = response.filters; //model for storing response from API                
                                    console.log($scope.details);
                                    // pagination
                                    $scope.currentPage = page;
                                    $scope.pageSize = response.total*6;
                                }, function(error) {
                                    console.log(error);
                                });
                        }
                        else{
                            searchService.search_ingredient(query, page, null, sortby)
                                .then(function(response) {
                                    $scope.details = response;
                                    $scope.filts = response.filters; //model for storing response from API                
                                    console.log($scope.details);
                                    // pagination
                                    $scope.currentPage = page;
                                    $scope.pageSize = response.total*6;
                                }, function(error) {
                                    console.log(error);
                                });
                        }

                    }};

                    /* function that opens the modal */
                    // is create recipe a modal anymore??
                    $scope.addRecipeIngredModal = function() {
                        $scope.lastChecked = null;
                        $('#add-ingredients-modal')
                            .openModal();
                    };

                    /* watch the value of nutrient value to detect change 
                      and update the last checked value */
                    $scope.$watchCollection('checklistIngs', function(
                        newVal, oldVal) {
                        if (newVal.length > 0) {
                            $scope.lastChecked = newVal[
                                newVal.length - 1];
                        }
                    }, true);

                    /* function to remove an ingredient from the recipe checklist and templist */
                    $scope.removeIngredient = function(element) {
                        console.log(element);
                        // remove ingredient from checklist temp array
                        var index1 = $scope.checklistIngs
                            .indexOf(element);

                        if(index1>=0){
                        $scope.checklistIngs.splice(
                            index1, 1);
}

                        // remove ingredient from checklist array
                        var index2 = $scope.checklistIngredients
                            .indexOf(element);
                        if(index2>=0){
                        $scope.checklistIngredients.splice(
                            index2, 1);}

                        // remove ingredient from recipe ingredients
                        var index3 = -1;
                        for(var ind=0; ind<$scope.ingredientDisplay.length;ind++){
                            if(element.id===$scope.ingredientDisplay[ind].ingredient){
                                index3 = ind;
                                break;
                            }
                        }
                        if(index3>=0){
                        $scope.ingredientDisplay.splice(index3,
                            1);}

                        console.log(index1, index2, index3);
                    };

                    /* function to remove an ingredient from the recipe */
                    $scope.removeIngs = function(index) {
                        console.log(index);
                        

                        // remove ingredient from checklist array
                        var index2 = -1;
                        for(var i=0; i<$scope.checklistIngredients.length;i++){
                            if($scope.checklistIngredients[i].id===$scope.ingredientDisplay[index].ingredient)
                            {index2 = i;}
                        }
                        if(index2>=0){
                        $scope.checklistIngredients.splice(
                            index2, 1);}

                        // remove ingredient from recipe ingredients
                        $scope.ingredientDisplay.splice(index,
                            1);

                    };


                    /* add contents from the modal to the recipe */
                    $scope.addContents = function() {
                        /*loop over the checklist mode (nutrient value) and
                          add to the ingredients */

                        console.log($scope.checklistIngs);
                        console.log($scope.checklistIngredients);

                        for (var j = 0; j <
                            $scope.checklistIngs.length; j++
                        ) {
                            $scope.checklistIngredients.push($scope.checklistIngs[j]);
                        }
                        $scope.checklistIngs=[];

                        for (var i = $scope.ingredientDisplay.length; i <
                            $scope.checklistIngredients.length; i++
                        ) {
                            $scope.ingredientDisplay.push({
                                ingredient: $scope.checklistIngredients[
                                    i].id,
                                measure: $scope.checklistIngredients[
                                    i].measure[0].id,
                                carbohydrate: $scope.checklistIngredients[
                                    i].carbohydrate_tot,
                                fats: $scope.checklistIngredients[
                                    i].fat_tot,
                                protein: $scope.checklistIngredients[
                                    i].protein_tot,
                                quantity: 1
                            });
                        }

                        $('#add-ingredients-modal')
                            .closeModal();

                        /* cleanup checklist and search results */
                        $scope.lastChecked = null;
                        $scope.details = undefined;
                        $scope.filts = undefined;
                        $scope.query = undefined;
                        $scope.pageSize = null;
                        $scope.currentPage = null;

                    };
                    //checks whether an ingredient is already selected or not
                    $scope.checkIfSelected = function(index){
                        for(var i=0; i<$scope.checklistIngredients.length; i++){
                            if($scope.checklistIngredients[i].id===index){
                                return true;
                            }
                        }
                        return false;
                    }

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
                                        $scope.ingredientDisplay[
                                            i].recipe = id;
                                        recipeService.createRecipeIng(
                                                $scope.ingredientDisplay[
                                                    i])
                                            .then(
                                                function(
                                                    response) {
                                                    //TODO: Add meaningful behaviour on successful return
                                                }, function(
                                                    error) {
                                                    console.log(
                                                        error
                                                    );
                                                });
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

                    /* Nutritional Information calculations */
                    $scope.totalCarb = 0;
                    $scope.totalProtein = 0;
                    $scope.totalFat = 0;
                    $scope.$watch('ingredientDisplay', function() {
                        for (var i = 0; i < $scope.ingredientDisplay
                            .length; i++) {
                            $scope.totalCarb += parseFloat(
                                $scope.ingredientDisplay[
                                    i]
                                .carbohydrate *
                                $scope.ingredientDisplay[
                                    i]
                                .quantity);
                            $scope.totalProtein +=
                                parseFloat($scope.ingredientDisplay[
                                        i]
                                    .protein * $scope
                                    .ingredientDisplay[i].quantity
                                );
                            $scope.totalFat += parseFloat(
                                $scope.ingredientDisplay[
                                    i]
                                .fats * $scope.ingredientDisplay[
                                    i]
                                .quantity);
                        }

                    }, true);

                    /* function called for saving the plan */
                    $scope.finalizeRecipeCreation = function() {
                        $scope.recipe.directions = '';
                        for (var i = 0; i < $scope.stepsToCreateRecipes
                            .length; i++) {
                            $scope.recipe.directions = $scope.recipe
                                .directions + ' \n' + $scope.stepsToCreateRecipes[
                                    i];
                        }
                        $scope.recipe.prep_time = $scope.prep_hours +
                            ':' + $scope.prep_mins + ':00';
                        $scope.recipe.cook_time = $scope.cook_hours +
                            ':' + $scope.cook_mins + ':00';
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