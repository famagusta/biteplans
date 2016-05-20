'use strict';

app.controller('editRecipeController', ['$scope','AuthService',
    '$routeParams', 'constants', 'recipeService',
    '$location', 'planService', 'searchService', function ($scope, AuthService, $routeParams, constants, recipeService, $location, planService, searchService) {
   
        AuthService.isAuthenticated()
        .then(function(response) {
            var isAuthenticated = response.status;
            
            if (isAuthenticated) {
                //This is to store the checked results from the given search page
                    $scope.checklistIngs = [];

                    //this is to store all the checked/selected results
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
                    $scope.recipe = {};
                
                                          
                                              
                var getRecipe = function() {
                    recipeService.getRecipe($routeParams.id).then(function(response) {
                    $scope.recipe = response;
                    console.log($scope.recipe);
                    for(var i=0;i<$scope.recipe.recipeIngredients.length;i++){
                    $scope.recipe.recipeIngredients[i].quantity  = parseFloat($scope.recipe.recipeIngredients[i].quantity);
                    $scope.ingredientDisplay.push(
                        $scope.recipe.recipeIngredients[i]);
                        
                    $scope.ingredientDisplay[i].selected_measure = $scope.recipe.recipeIngredients[i].measure.id;
                    }
                    if(response.source===null){
                        delete $scope.recipe.source;
                    }
                        
                    if(response.image===null){
                        delete $scope.recipe.image;
                    }
                    else{
                        $scope.recipe_image_file = $scope.recipe.image;
                        delete $scope.recipe.image;
                    }
                        
                    if(response.url===null){
                        delete $scope.recipe.url;
                    }
                        
                    
                        
                    $scope.created_by = response.created_by;
                    delete $scope.recipe.created_by;
                        
                    $scope.stepsToCreateRecipes = [$scope.recipe.directions];
                    $scope.recipe.recipeIngredients = undefined;
                    var cookTime =$scope.recipe.cook_time.split(":");
                        $scope.cookHours = parseInt(cookTime[0]);
                        $scope.cookMins = parseInt(cookTime[1]);
                    
                     var prepTime =$scope.recipe.prep_time.split(":");
                         $scope.prepHours = parseInt(prepTime[0]);
                        $scope.prepMins = parseInt(prepTime[1]);
                        console.log(prepTime,cookTime);
                    $scope.checklistIngredients = $scope.ingredientDisplay;
                                        
                 console.log($scope.checklistIngredients);
                    
                     
                }, function(error) {
                    console.log(error);
                });
            };
                
                getRecipe();
                
  
                
                 /* search function for the ingredient modal */
                    $scope.foodgroup = [];


                    //Checks for applied filters, as soon as a new filter is applied or removed
                    //search result is changed.

                    $scope.$watchCollection('foodgroup', function(
                        newVal, oldVal) {

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

                        }
                    };
                
                  $scope.$watchCollection('checklistIngs',
                        function(
                            newVal, oldVal) {
                            if (newVal.length > 0) {
                                $scope.lastChecked = newVal[
                                    newVal.length - 1];
                            }
                        }, true);

                    /* function to remove an ingredient from the recipe checklist and templist */
                    $scope.removeIngredient = function(element) {
//                        console.log(element);
                        // remove ingredient from checklist temp array
                        var index1 = $scope.checklistIngs
                            .indexOf(element);

                        if (index1 >= 0) {
                            $scope.checklistIngs.splice(
                                index1, 1);
                        }

                        // remove ingredient from checklist array

                        //                        var index = $scope.checklistIngredients.filter(function(el) {
                        //                            return el.id === element; // Filter out the appropriate one
                        //                        })
                        var index2 = $scope.checklistIngredients
                            .indexOf(element);
                        if (index2 >= 0) {
                            $scope.checklistIngredients.splice(
                                index2, 1);
                        }

                        // remove ingredient from recipe ingredients
                        var index3 = -1;
                        for (var ind = 0; ind < $scope.ingredientDisplay
                            .length; ind++) {
//                            console.log(element.id);
//                            console.log($scope.ingredientDisplay[
//                                ind]);
                            if (element.id === $scope.ingredientDisplay[
                                ind].ingredient.id) {
                                index3 = ind;
                                break;
                            }
                        }
                        if (index3 >= 0) {
                            $scope.ingredientDisplay.splice(
                                index3,
                                1);
                        }

//                        console.log(index1, index2, index3);
                    };

                    /* function to remove an ingredient from the recipe */
                    $scope.removeIngs = function(index) {
//                        console.log(index);


                        // remove ingredient from checklist array
                        var index2 = -1;
                        for (var i = 0; i < $scope.checklistIngredients
                            .length; i++) {
                            if ($scope.checklistIngredients[i].id ===
                                $scope.ingredientDisplay[index]
                                .ingredient.id) {
                                index2 = i;
                            }
                        }
                        if (index2 >= 0) {
                            $scope.checklistIngredients.splice(
                                index2, 1);
                        }

                        // remove ingredient from recipe ingredients

                        $scope.ingredientDisplay.splice(index,
                            1);

                        // remove ingredient from recipe ingredients
                        $scope.AdditionalIngredientInfo.splice(
                            index,
                            1);
                    };
          
                
                  /* add contents from the modal to the recipe */
                    $scope.addContents = function() {
                        /*loop over the checklist mode (nutrient value) and
                          add to the ingredients 
                          also, add the weight of each ingredient measure to 
                          use in calculating total nutrient

                        add to the ingredients */



                        for (var j = 0; j <
                            $scope.checklistIngs.length; j++
                        ) {
                            $scope.checklistIngredients.push(
                                $scope.checklistIngs[j]);
                        }
                        $scope.checklistIngs = [];
                        
//                        $scope.ingredientDisplay = $scope.checklistIngredients;

                       console.log($scope.ingredientDisplay);
//                        console.log($scope.ingredientDisplay);
                        for (var i = $scope.ingredientDisplay.length; i <
                            $scope.checklistIngredients.length; i++
                        ) {
                            
                            //populate ingredient display in identical format as original request
                            // will populate ids later (after patch)
                            $scope.ingredientDisplay.push({
                                ingredient: $scope.checklistIngredients[i],
                                measure: $scope.checklistIngredients[i].measure[0],
                                quantity : 1
                            });
                            
                            
                            // call API to get addtional ingredient information

                            searchService.get_ingredient_addtnl_info(
                                    $scope
                                    .checklistIngredients[i]
                                    .id)
                                .then(function(response) {
                                    //model for storing response from API                
                                    $scope.AdditionalIngredientInfo
                                        .push(response);
                                }, function(error) {
                                    console.log(error);
                                });

                            var obj = {
                                 ingredient: $scope.checklistIngredients[
                                    i],
                                selected_measure: $scope
                                    .checklistIngredients[
                                        i].measure[0],
                                quantity: 1,
                            }
                            
//                            console.log($scope.ingredientDisplay);
//                            console.log(obj);

//                            $scope.ingredientDisplay.push({
//                                ingredient: $scope.checklistIngredients[
//                                    i],
//                                selected_measure: $scope
//                                    .checklistIngredients[
//                                        i].measure[0],
//                                quantity: 1,
//                            });
                        }
                        
                        
    
                        

              
           

                        $('#add-ingredients-modal')
                            .closeModal();

                        /* cleanup checklist and search results */
                        $scope.details = undefined;
                        $scope.filts = undefined;
                        $scope.query = undefined;
                        $scope.pageSize = null;
                        $scope.currentPage = null;
//                        console.log($scope.lastChecked);

                    };
                
         
                



                    //checks whether an ingredient is already selected or not
                    $scope.checkIfSelected = function(index) {
                        for (var i = 0; i < $scope.checklistIngredients
                            .length; i++) {
                            if ($scope.checklistIngredients[i].id ===
                                index) {
                                return true;
                            }
                        }
                        return false;
                    }

                    
                    $scope.addMoreSteps = function() {
                        $scope.stepsToCreateRecipes.length += 1;
                    };
                
                       
                
                
                // delete selected ingredients for a given recipe while editing
                $scope.deleteSelectedIngredient = function (element) {
                    if ($scope.ingredientDisplay[element].id!==undefined) {
                    var ingredientIndex = $scope.ingredientDisplay[element].id;
                    console.log(ingredientIndex);
                    recipeService.deleteRecipeIngredient(ingredientIndex).then(function(response) {
                      $scope.ingredientDisplay.splice(element,1);
                    }, function(error) {
                       console.log(error); 
                    });
                        
                    }
                    else {
                        $scope.removeIngs(element);
                        
                    }
                };
                
                    $scope.addRecipeIngredModal = function() {
                        $scope.lastChecked = null;
                        $('#add-ingredients-modal')
                            .openModal();
                    };
                
                 $scope.removeIngredient = function(element) {
//                        console.log(element);
                        // remove ingredient from checklist temp array
                        var index1 = $scope.checklistIngs
                            .indexOf(element);

                        if (index1 >= 0) {
                            $scope.checklistIngs.splice(
                                index1, 1);
                        }

                        // remove ingredient from checklist array

                        //                        var index = $scope.checklistIngredients.filter(function(el) {
                        //                            return el.id === element; // Filter out the appropriate one
                        //                        })
                        var index2 = $scope.checklistIngredients
                            .indexOf(element);
                        if (index2 >= 0) {
                            $scope.checklistIngredients.splice(
                                index2, 1);
                        }

                        // remove ingredient from recipe ingredients
                        var index3 = -1;
                        for (var ind = 0; ind < $scope.ingredientDisplay
                            .length; ind++) {
//                            console.log(element.id);
//                            console.log($scope.ingredientDisplay[
//                                ind]);
                            if (element.id === $scope.ingredientDisplay[
                                ind].ingredient.id) {
                                index3 = ind;
                                break;
                            }
                        }
                        if (index3 >= 0) {
                            $scope.ingredientDisplay.splice(
                                index3,
                                1);
                        }

//                        console.log(index1, index2, index3);
                    };

                    /* function to remove an ingredient from the recipe */
                    $scope.removeIngs = function(index) {
//                        console.log(index);


                        // remove ingredient from checklist array
                        var index2 = -1;
                        for (var i = 0; i < $scope.checklistIngredients
                            .length; i++) {
                            if ($scope.checklistIngredients[i].id ===
                                $scope.ingredientDisplay[index]
                                .ingredient.id) {
                                index2 = i;
                            }
                        }
                        if (index2 >= 0) {
                            $scope.checklistIngredients.splice(
                                index2, 1);
                        }

                        // remove ingredient from recipe ingredients

                        $scope.ingredientDisplay.splice(index,
                            1);

                        // remove ingredient from recipe ingredients
                        $scope.AdditionalIngredientInfo.splice(
                            index,
                            1);
                    };
                
                $scope.uploadFile = function(id) {
                        var file = $scope.recipe_image_file;
                        var url = constants.API_SERVER +
                            'biteplans/recipe/recipes/' + id +
                            '/';
                        if (file) {
                            recipeService.uploadRecipeImage(
                                file, url);
                        }
                    };
                
                 /* function called for saving the recipe */
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
                        updateRecipe($scope.recipe);
                    };
                
                 $scope.counter = 0;
                // updates contents of recipes after editing
                 var updateRecipe = function(recipe) {
                        recipeService.updateRecipe(recipe, recipe.id)
                            .then(
                                function(response) {
                                    for (var i = 0; i < $scope.ingredientDisplay
                                        .length; i++) {
                                        /* create a recipe ingred object to send to server */
                                        if ($scope.ingredientDisplay[i].id === undefined){
                                        var recipeIngred = {
                                            recipe: recipe.id,
                                            ingredient: $scope
                                                .ingredientDisplay[
                                                    i]
                                                .ingredient
                                                .id,
                                            measure: $scope
                                                .ingredientDisplay[
                                                    i]
                                                .measure
                                                .id,
                                            quantity: $scope
                                                .ingredientDisplay[
                                                    i]
                                                .quantity
                                        }

                                        recipeService.createRecipeIng(
                                                recipeIngred)
                                            .then(
                                                function(
                                                    response) {
                                                    //TODO: Add meaningful behaviour
                                                    //    on successful return
                                                        $scope.counter += 1
                                                        $scope.checkIfCompleted();
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

                                    }
                                    else{
                                        
                                        recipeService.updateRecipeIngredient(
                                                $scope.ingredientDisplay[i], $scope.ingredientDisplay[i].id)
                                            .then(
                                                function(
                                                    response) {
                                                    //TODO: Add meaningful behaviour
                                                    //    on successful return
                                                        $scope.counter += 1
                                                        $scope.checkIfCompleted();
                                                }, function(
                                                    error) {
                                                    console.log(
                                                        error
                                                    );
                                                });
                                        
                                        
                                        
                                    }
                                    
                                    }

                                    $scope.uploadFile($scope.recipe.id);
                                    /* Redirect to view recipe page */
                                    
                                }, function(error) {
                                    console.log(
                                        'recipe could not be created, try again later',
                                        error);
                                });
                    };
                
                $scope.checkIfCompleted = function(){
                    
                    console.log($scope.counter);
                    if($scope.counter===$scope.ingredientDisplay.length){
                        
                        console.log($scope.counter);
                        
                        $location.path(
                                        '/viewRecipe/' + $scope.recipe.id
                                    );
                        
                    }
                }


                
                
                
                                
                }
            });
        }
]);