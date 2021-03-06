/* global app, $, console */

app.controller('createRecipeController', ['$scope', 'AuthService',
    '$routeParams', 'constants',
    'searchService', '$location', 'recipeService', 'summaryService',
    function($scope, AuthService, $routeParams, constants,
        searchService,
        $location,
        recipeService, summaryService) {
        'use strict';
        
        
        AuthService.isAuthenticated()
            .then(function(response) {
                var isAuthenticated = response.status;
                var currentUser = response.pk;
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
                    $scope.AdditionalIngredientInfo = [];

                    $scope.mySavedStuffQuery = '';
                    //variables to gather additional information
                    $scope.prepHours = 0;
                    $scope.prepMins = 0;
                    $scope.cookHours = 0;
                    $scope.cookMins = 0;
                    $scope.recipe = {};
                    $scope.mySavedStuffCurrentPage = 1;
                    
                    /* crop the required input file */
                    $scope.cropper = {};
                    $scope.cropper.urlInput = null;
                    $scope.cropper.fileInput = null;
                    $scope.cropper.sourceImage = null;
                    $scope.cropper.croppedImage = null;
                    $scope.fileSizeError = false;
                    $scope.fileExtn = '';
                    
                    // some images are protected from cross domain sharing
                    $scope.urlCopyrightError = false;

                    $scope.$watch('cropper.fileInput', function(newVal, oldVal){
                        if(newVal){
                            var file_size = dataURLtoBlob(newVal).size;
                            var image_blob = dataURLtoBlob(newVal);
                            $scope.fileExtn = (image_blob.type).split('/')[1];
                            
                            if (file_size > 5242880)
                            {
                                $scope.fileSizeError = true;
                                $scope.cropper.sourceImage = null;
                                $scope.cropper.croppedImage = null;
                            }
                            else
                            {
                                $scope.cropper.sourceImage = newVal;
                                $scope.fileSizeError = false;
                            }
                        }
                    });
                    
                    $scope.urlChanged = function(){
                        var newVal = $scope.cropper.urlInput;
                        if(newVal){
                            if(ValidURL(newVal)){
                                $scope.cropper.sourceImage = null;
                                var img = new Image();
                                img.crossOrigin = "Anonymous";
                                
                                var downloadingImage = new Image();
                                downloadingImage.crossOrigin = "Anonymous";
                                
                                downloadingImage.onload = function(){
                                    $scope.urlCopyrightError = false;
                                    var canvas = document.createElement("canvas");
                                    canvas.width = this.width;
                                    canvas.height = this.height;

                                    canvas.getContext("2d").drawImage(this, 0, 0);
                                    var resultURL = canvas.toDataURL();
                                    var file_size = dataURLtoBlob(resultURL).size;
                                    if (file_size > 5242880)
                                    {
                                        $scope.fileSizeError = true;
                                        $scope.cropper.sourceImage = null;
                                        $scope.cropper.croppedImage = null;

                                    }
                                    else
                                    {
                                        $scope.cropper.sourceImage = resultURL;
                                        $scope.fileSizeError = false;
                                    }
                                };
                                
                                downloadingImage.onerror = function(){
                                    $scope.urlCopyrightError = true;
                                };
                                downloadingImage.src=newVal;
                                
                            }
                        }else{
                            $scope.cropper.sourceImage = null;
                        }
                    };

                    /* variables & functions to upload image file for recipe */
                    $scope.formdata = new FormData();
                    $scope.getTheFiles = function($files) {
                        angular.forEach($files, function(value,
                            key) {
                            $scope.formdata.append(
                                'file', value);
                        });

                    };

                    $scope.uploadFile = function(id) {
                        if($scope.cropper.croppedImage){
                            var image_blob = dataURLtoBlob($scope.cropper.croppedImage);
                            var fileName = 'recipe_pic.' + $scope.fileExtn;
                            var file = new File([image_blob], fileName);

                            var url = '/recipes/recipe/' + id + '/';
                            if (file !== undefined && file !== null) {
                                recipeService.uploadRecipeImage(
                                    file, url).then(function(response){
                                         $location.path(
                                            '/recipes/view-recipe/' + id
                                        );

                                    }, function(error){
                                        console.log(error);
                                    });
                            }
                        }
                    };
                    
                    $scope.initialize_recipe = function(){
                        var id = $routeParams.id;
                        recipeService.updateRecipe($scope.recipe, id).then(function(response){
                        }, function(error)
                        {
                            console.log(error);
                        });
                };


                    /* Nutritional Information calculations based on changes to
                        selected ingredients */
                    var checkIngredNutritionQty = function(ingredient, nutrient, additionalNutrition){
                        /* check if our ingredient and nutrient have valid numbers */
                        var result = false;
                        if(additionalNutrition !== undefined){
                            if (additionalNutrition[nutrient] && ingredient.quantity && ingredient.selected_measure.weight){
                                result = true;
                            }
                        } else {
                            if (ingredient.ingredient[nutrient] && ingredient.quantity && ingredient.selected_measure.weight){
                                result = true;
                            }
                        }
                        return result;
                    };
                    
                    
                    
                    $scope.calculateNutritionTotal = function(nutrient) {
                            var total = 0;
                            var servings = parseInt($scope.recipe.servings);
                            //prevent divide by zero
                            if (!servings) {
                                servings = 1;
                            }
                            for (var i = 0; i < $scope.ingredientDisplay
                                .length; i++) {
                                if (checkIngredNutritionQty($scope.ingredientDisplay[i], nutrient)) {
                                    total += parseFloat($scope.ingredientDisplay[
                                            i].ingredient[nutrient]) *
                                            parseFloat($scope.ingredientDisplay[
                                            i].quantity) * parseFloat(
                                            $scope.ingredientDisplay[i]
                                            .selected_measure.weight) /
                                            (100 * servings * parseFloat(
                                                $scope.ingredientDisplay[i]
                                                .selected_measure.amount));
                                }
                            }
                            return total;
                        };
                        /* calculates additional nutritional information */
                    $scope.calculateAddtnlNutritionTotal = function(
                        nutrient) {
                        var total = 0;
                        var servings = parseInt($scope.recipe.servings);
                        //prevent divide by 0
                        if (!servings) {
                            servings = 1;
                        }
                        for (var i = 0; i < $scope.AdditionalIngredientInfo
                            .length; i++) {
                            if(checkIngredNutritionQty($scope.ingredientDisplay[i], nutrient, $scope.AdditionalIngredientInfo[i])){
                                total += parseFloat($scope.AdditionalIngredientInfo[
                                        i][nutrient]) * parseFloat(
                                        $scope.ingredientDisplay[i]
                                        .quantity) * parseFloat(
                                        $scope.ingredientDisplay[i]
                                        .selected_measure.weight) /
                                        (100 * servings * parseFloat(
                                            $scope.ingredientDisplay[i]
                                            .selected_measure.amount));
                            }
                        }
                        return total;
                    };



                    /* search function for the ingredient modal */
                    $scope.foodgroup = [];
                    $scope.sortby = '';

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
                        if (query !==undefined && $scope.foodgroup.length >0) {
                            searchService.search_ingredient(query, page, $scope.foodgroup, sortby)
                                .then(function(response) {
                                    $scope.details = response;
                                    $scope.filts = response.filters;
                                //model for storing response from API                
                                    // pagination
                                    $scope.currentPage = page;
                                    $scope.pageSize = response.total*6;
                                }, function(error) {
                                    console.log(error);
                                });
                        }
                        else if (query !== undefined && $scope.foodgroup.length === 0) {
                            searchService.search_ingredient(query, page, null, sortby)
                                .then(function(response) {
                                    $scope.details = response;
                                    $scope.filts = response.filters; 
                                    console.log($scope.details);
                                    //model for storing response from API                
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
                                    $scope.filts = response.filters; 
                                    //model for storing response from API                
                                    // pagination
                                    $scope.currentPage = page;
                                    $scope.pageSize = response.total*6;
                                }, function(error) {
                                    console.log(error);
                                });
                        }

                        }
                    };

                    /* function that opens the add ingredient modal */
                    $scope.addRecipeIngredModal = function() {
                        $scope.lastChecked = null;
                        $('#add-ingredients-modal')
                            .openModal();
                        $scope.details = undefined;
                        $scope.filts = undefined;
                        $scope.query = undefined;
                        $scope.pageSize = null;
                        $scope.currentPage = null;
                        $scope.foodgroup = [];
                    };
                    
                    //opens modal to add ingredients/recipes from history
                    $scope.openQuickToolsModal = function(index) {
                        $scope.getMySavedFoods();
                        $('#quick-tools-modal')
                            .openModal();
                    };
                    
                    /* function that opens the upload image modal */
                    $scope.uploadImageModal = function() {
                        $('#upload-image-modal')
                            .openModal();
                    };

                    /* watch the value of nutrient value to detect change 
                      and update the last checked value */
                    $scope.$watchCollection('checklistIngs', function(newVal, oldVal) {
                            if (newVal.length > 0) {
                                $scope.lastChecked = newVal[newVal.length - 1];
                            }
                        }, true);

                    /* function to remove an ingredient from the recipe 
                    checklist and templist */
                    $scope.removeIngredient = function(element) {
                        // remove ingredient from checklist temp array
                        var index1 = $scope.checklistIngs
                            .indexOf(element);

                        if (index1 >= 0) {
                            $scope.checklistIngs.splice(index1, 1);
                        }

                        console.log(element);
                        console.log($scope.checklistIngredients);
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
                            if (element.id === $scope.ingredientDisplay[
                                ind].ingredient.id) {
                                index3 = ind;
                                break;
                            }
                        }
                        if (index3 >= 0) {
                            $scope.ingredientDisplay.splice(index3,1);
                        }
                    };

                    
                    /* function to remove an ingredient from the recipe */
                    $scope.removeIngs = function(index) {
                        // remove ingredient from checklist array
                        var index2 = -1;
                        for (var i = 0; i < $scope.checklistIngredients.length; i++) {
                            if ($scope.checklistIngredients[i].id === 
                                $scope.ingredientDisplay[index].ingredient.id) {
                                index2 = i;
                            }
                        }
                        if (index2 >= 0) {
                            $scope.checklistIngredients.splice(index2, 1);
                        }

                        // remove ingredient from recipe ingredients

                        $scope.ingredientDisplay.splice(index, 1);

                        // remove ingredient from recipe ingredients
                        $scope.AdditionalIngredientInfo.splice(index, 1);
                    };


                    /* add contents from the modal to the recipe */
                    $scope.addContents = function() {
                        /*loop over the checklist mode (nutrient value) and
                          add to the ingredients 
                          also, add the weight of each ingredient measure to 
                          use in calculating total nutrient

                        add to the ingredients */
                        for (var j = 0; j < $scope.checklistIngs.length; j++){
                            $scope.checklistIngredients.push($scope.checklistIngs[j]);
                        }
                        $scope.checklistIngs = [];


                        for (var i = $scope.ingredientDisplay.length; 
                             i < $scope.checklistIngredients.length; i++){
                            // call API to get addtional ingredient information

                            searchService.get_ingredient_addtnl_info(
                                    $scope.checklistIngredients[i].id)
                                .then(function(response) {
                                    //model for storing response from API                
                                    $scope.AdditionalIngredientInfo.push(response);
                                }, function(error) {
                                    console.log(error);
                                });


                            $scope.ingredientDisplay.push({
                                ingredient: $scope.checklistIngredients[i],
                                selected_measure: $scope.checklistIngredients[i].measure[0],
                                quantity: parseFloat($scope.checklistIngredients[i]
                                                     .measure[0].amount),
                            });
                            
                        }

                        $('#add-ingredients-modal').closeModal();
                        
                        $('#quick-tools-modal').closeModal();

                        /* cleanup checklist and search results */
                        $scope.details = undefined;
                        $scope.filts = undefined;
                        $scope.query = undefined;
                        $scope.pageSize = null;
                        $scope.currentPage = null;
                        $scope.foodgroup = []; // this created a bug
                        
                        $scope.mySavedStuffQuery = '';

                    };
                    
                    $scope.updateQuantity = function(index){
                        $scope.ingredientDisplay[index].quantity = 
                            parseFloat($scope.ingredientDisplay[index]
                                       .selected_measure.amount);
                    };
                    
                    //checks whether an ingredient is already selected or not
                    $scope.checkIfSelected = function(ingredient) {
                        for (var i = 0; i < $scope.checklistIngs.length; i++) {
                            if ($scope.checklistIngs[i].id === ingredient.id) {
                                return true;
                            }
                        }
                        return false;
                    };
                    
                    $scope.checkInBigBasket = function(ingredient){
                        for (var i = 0; i < $scope.checklistIngredients.length; i++) {
                            if ($scope.checklistIngredients[i].id === ingredient.id) {
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
                                    
                                    for (var i = 0; i < $scope.ingredientDisplay.length; i++)
                                    {
                                        /* create a recipe ingred object to send to server */
                                        (function(cntr_i){
                                        if ($scope.ingredientDisplay[cntr_i].description === undefined || $scope.ingredientDisplay[cntr_i].description === null){
                                            $scope.ingredientDisplay[cntr_i].description = ''
                                        }
                                        var recipeIngred = {
                                            recipe: id,
                                            ingredient: $scope
                                                .ingredientDisplay[cntr_i].ingredient.id,
                                            measure: $scope
                                                .ingredientDisplay[cntr_i]
                                                .selected_measure.id,
                                            quantity: $scope
                                                .ingredientDisplay[cntr_i].quantity,
                                            description: $scope
                                                .ingredientDisplay[cntr_i].description
                                        };

                                        recipeService.createRecipeIng(recipeIngred)
                                            .then(function(response) {
                                                    //TODO: Add meaningful behaviour
                                                    //    on successful return
                                                    if(cntr_i==
                                                       $scope.ingredientDisplay.length-1){
                                                        $scope.uploadFile(id);
                                                        $location.path(
                                                            '/recipes/view-recipe/' + id
                                                        );
                                                    }
                                                }, function(error) {
                                                    console.log(error);
                                                });
                                        })(i);

                                        /* upload image file to server upon id creation 
                                           Note: it was easier to do this separately since
                                           the other option was to rewrite sending data in 
                                           a form as opposed to urlencoding it */

                                    }

//                                    $scope.uploadFile(id);
                                    /* Redirect to view recipe page */
                                    
                                }, function(error) {
                                    console.log(
                                        'recipe could not be created, try again later',
                                        error);
                                });
                    };
                    
                    $scope.validateRecipe = function() {
                        if ($scope.recipe.name) {
                             $scope.finalizeRecipeCreation();
                        }
                        else {
                            $scope.recipeError = 'Insufficient Information About Recipe';
                        }
                    };
                    


                    /* function called for saving the plan */
                    $scope.finalizeRecipeCreation = function($files) {
                        $scope.recipe.directions = '';
                        for (var i = 0; i < $scope.stepsToCreateRecipes.length; i++) {
                            if($scope.stepsToCreateRecipes[i].length>0){
                            $scope.recipe.directions = $scope.recipe
                                .directions + $scope.stepsToCreateRecipes[i] + '{LineBreak}';
                            }
                        }
                        $scope.recipe.prep_time = $scope.prepHours +
                            ':' + $scope.prepMins + ':00';
                        $scope.recipe.cook_time = $scope.cookHours +
                            ':' + $scope.cookMins + ':00';
                        createRecipe($scope.recipe);
                    };
                    
                    $scope.getMySavedFoods = function(page){
                        if(!page){
                            page = 1;
                        }
                        
                        $scope.checklistIngredients = $scope.checklistIngredients
                            .concat($scope.checklistIngs.splice(0,$scope
                                                                .checklistIngs.length));
                        
                        summaryService.getShortlistIngredients(page).then(function(response){

                            $scope.mySavedStuff = response;
                            // pagination
                            $scope.mySavedStuffCurrentPage = page;
                            $scope.mySavedStuffPageSize = response.total * 6;

                        }, function(error){
                            console.log(error);
                        });
                        
                    };
                    
                    $scope.getMySavedFoods();
                    
                    $scope.searchMySavedStuff = function(page){
                        summaryService.searchShortlistedStuff($scope.mySavedStuffQuery, page, "ingredients")
                            .then(function(response){

                            $scope.mySavedStuff = response;
                            //$scope.filts = response.filters; //model for storing response from API                
                            // pagination
                            $scope.mySavedStuffCurrentPage = page;
                            $scope.mySavedStuffPageSize = response.total *
                                6;
                        }, function(error){

                        });
                    
                    };
        
                    $scope.getSavedStuffNextPage = function(page){
                        if($scope.mySavedStuffQuery.length>0){
                            $scope.searchMySavedStuff(page);
                        }else{
                            $scope.getMySavedFoods(page);
                        }
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

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}