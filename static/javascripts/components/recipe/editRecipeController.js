/* global app, $, console */

app.controller('editRecipeController', ['$scope', 'AuthService',
    '$routeParams', 'constants', 'recipeService',
    '$location', 'planService', 'searchService', 'summaryService',
    function($scope, AuthService, $routeParams, constants, recipeService, $location, planService, searchService, summaryService)
    {
        'use strict';
        
        AuthService.isAuthenticated()
            .then(function(response)
            {
                var isAuthenticated = response.status;
                var currentUser = response.pk;
                if (isAuthenticated)
                {
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
                    $scope.mySavedStuffQuery = '';
                    
                    /* crop the required input file */
                    $scope.cropper = {};
                    $scope.cropper.urlInput = null;
                    $scope.cropper.fileInput = null;
                    $scope.cropper.sourceImage = null;
                    $scope.cropper.croppedImage = null;
                    $scope.fileSizeError = false;
                    $scope.urlCopyrightError = false;
                    $scope.fileExtn = '';
                    
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
                                
                                var downloadingImage = new Image();
                                downloadingImage.crossOrigin = "anonymous";
                                
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
                                
                                // async image download
                                downloadingImage.src=newVal;
                                
                            }
                        }else{
                            $scope.cropper.sourceImage = null;
                        }
                    };
                    
                    /* function that opens the upload image modal */
                    $scope.uploadImageModal = function()
                    {
                        $('#upload-image-modal')
                            .openModal();
                    };
                    var getRecipe = function()
                    {
                        recipeService.getRecipe($routeParams.id)
                            .then(function(response)
                            {
                                $scope.recipe = response;
                            
                                if($scope.recipe.created_by !== currentUser){
                                    //prevent unauthorized edits
                                    $location.path('/recipes/view-recipe/' + $routeParams.id + '/');
                                }
                                for (var i = 0; i < $scope.recipe.recipeIngredients.length; i++)
                                {
                                    $scope.recipe.recipeIngredients[i].quantity = parseFloat($scope.recipe.recipeIngredients[
                                        i].quantity);
                                    $scope.ingredientDisplay.push($scope.recipe.recipeIngredients[i]);
                                    $scope.ingredientDisplay[i].measure = $scope.recipe.recipeIngredients[i].measure;
                                }
                                if (response.source === null)
                                {
                                    delete $scope.recipe.source;
                                }
                                if (response.image === null)
                                {
                                    delete $scope.recipe.image;
                                }
                                else
                                {
                                    $scope.recipe_image_file = $scope.recipe.image;
                                    delete $scope.recipe.image;
                                }
                                if (response.url === null)
                                {
                                    delete $scope.recipe.url;
                                }
                                $scope.created_by = response.created_by;
                                delete $scope.recipe.created_by;
                                
//                                $scope.stepsToCreateRecipes = [
//                                    $scope.recipe.directions
//                                    ];
                            
                                $scope.stepsToCreateRecipes = $scope.recipe
                                    .directions.split('\n');
                                $scope.recipe.recipeIngredients = undefined;
                                var cookTime = $scope.recipe.cook_time.split(":");
                                $scope.cookHours = parseInt(cookTime[0]);
                                $scope.cookMins = parseInt(cookTime[1]);
                                var prepTime = $scope.recipe.prep_time.split(":");
                                $scope.prepHours = parseInt(prepTime[0]);
                                $scope.prepMins = parseInt(prepTime[1]);
                                $scope.checklistIngredients = $scope.ingredientDisplay;
                            }, function(error)
                            {
                                console.log(error);
                            });
                    };
                    getRecipe();
                    /* search function for the ingredient modal */
                    $scope.foodgroup = [];
                    //Checks for applied filters, as soon as a new filter is applied or removed
                    //search result is changed.
                    $scope.$watchCollection('foodgroup', function(newVal, oldVal)
                    {
                        $scope.search(1, $scope.sortby);
                    });
                    //main search fn, executed on page change(page specifies page number to be displayed)
                    //checks whether applied sort order is same as previous sort order or not, 
                    //if not, then only make the request, if the order is same and filters are same,
                    //then do not make the request.
                    $scope.search = function(page, sortby)
                    {
                        $scope.details = undefined;
                        if ($scope.query !== undefined)
                        {
                            $scope.sortby = sortby;
                            $scope.checklistIngredients = $scope.checklistIngredients.concat($scope.checklistIngs.splice(0,
                                $scope.checklistIngs.length));
                            var query = $scope.query;
                            if (query !== undefined && $scope.foodgroup.length > 0)
                            {
                                searchService.search_ingredient(query, page, $scope.foodgroup, sortby)
                                    .then(function(response)
                                    {
                                        $scope.details = response;
                                        $scope.filts = response.filters; //model for storing response from API                
                                        // pagination
                                        $scope.currentPage = page;
                                        $scope.pageSize = response.total * 6;
                                    }, function(error)
                                    {
                                        console.log(error);
                                    });
                            }
                            else if (query !== undefined && $scope.foodgroup.length === 0 )
                            {
                                searchService.search_ingredient(query, page, null, sortby)
                                    .then(function(response)
                                    {
                                        $scope.details = response;
                                        $scope.filts = response.filters; //model for storing response from API                
                                        // pagination
                                        $scope.currentPage = page;
                                        $scope.pageSize = response.total * 6;
                                    }, function(error)
                                    {
                                        console.log(error);
                                    });
                            }
                            else
                            {
                                searchService.search_ingredient(query, page, null, sortby)
                                    .then(function(response)
                                    {
                                        $scope.details = response;
                                        $scope.filts = response.filters; //model for storing response from API                
                                        // pagination
                                        $scope.currentPage = page;
                                        $scope.pageSize = response.total * 6;
                                    }, function(error)
                                    {
                                        console.log(error);
                                    });
                            }
                        }
                    };
                    $scope.$watchCollection('checklistIngs', function(newVal, oldVal)
                    {
                        if (newVal.length > 0)
                        {
                            $scope.lastChecked = newVal[newVal.length - 1];
                        }
                    }, true);
                    /* function to remove an ingredient from the recipe checklist and templist */
                    $scope.removeIngredient = function(element)
                    {
                        // remove ingredient from checklist temp array
                        var index1 = $scope.checklistIngs.indexOf(element);
                        if (index1 >= 0)
                        {
                            $scope.checklistIngs.splice(index1, 1);
                        }
                        // remove ingredient from checklist array
                        //                        var index = $scope.checklistIngredients.filter(function(el) {
                        //                            return el.id === element; // Filter out the appropriate one
                        //                        })
                        var index2 = $scope.checklistIngredients.indexOf(element);
                        if (index2 >= 0)
                        {
                            $scope.checklistIngredients.splice(index2, 1);
                        }
                        // remove ingredient from recipe ingredients
                        var index3 = -1;
                        for (var ind = 0; ind < $scope.ingredientDisplay.length; ind++)
                        {
                            if (element.id === $scope.ingredientDisplay[ind].ingredient.id)
                            {
                                index3 = ind;
                                break;
                            }
                        }
                        if (index3 >= 0)
                        {
                            $scope.ingredientDisplay.splice(index3, 1);
                        }
                    };
                    /* function to remove an ingredient from the recipe */
                    $scope.removeIngs = function(index)
                    {
                        // remove ingredient from checklist array
                        var index2 = -1;
                        for (var i = 0; i < $scope.checklistIngredients.length; i++)
                        {
                            if ($scope.checklistIngredients[i].id === $scope.ingredientDisplay[index].ingredient.id)
                            {
                                index2 = i;
                            }
                        }
                        if (index2 >= 0)
                        {
                            $scope.checklistIngredients.splice(index2, 1);
                        }
                        // remove ingredient from recipe ingredients
                        $scope.ingredientDisplay.splice(index, 1);
                        // remove ingredient from recipe ingredients
                        $scope.AdditionalIngredientInfo.splice(index, 1);
                    };
                    /* add contents from the modal to the recipe */
                    $scope.addContents = function()
                    {
                        /*loop over the checklist mode (nutrient value) and
                          add to the ingredients 
                          also, add the weight of each ingredient measure to 
                          use in calculating total nutrient

                        add to the ingredients */
                        for (var j = 0; j < $scope.checklistIngs.length; j++)
                        {
                            $scope.checklistIngredients.push($scope.checklistIngs[j]);
                        }
                        $scope.checklistIngs = [];
                        //                        $scope.ingredientDisplay = $scope.checklistIngredients;
                        for (var i = $scope.ingredientDisplay.length; i < $scope.checklistIngredients.length; i++)
                        {
                            //populate ingredient display in identical format as original request
                            // will populate ids later (after patch)
                            $scope.ingredientDisplay.push(
                            {
                                ingredient: $scope.checklistIngredients[i],
                                measure: $scope.checklistIngredients[i].measure[0],
                                quantity: parseFloat($scope.checklistIngredients[i].measure[0].amount)
                            });
                            // call API to get addtional ingredient information
                            searchService.get_ingredient_addtnl_info($scope.checklistIngredients[i].id)
                                .then(function(response)
                                {
                                    //model for storing response from API                
                                    $scope.AdditionalIngredientInfo.push(response);
                                }, function(error)
                                {
                                    console.log(error);
                                });
                            var obj = {
                                    ingredient: $scope.checklistIngredients[i],
                                    measure: $scope.checklistIngredients[i].measure[0],
                                    quantity: parseFloat($scope.checklistIngredients[i].measure[0])
                                };
                        }
                        $('#add-ingredients-modal')
                            .closeModal();
                        /* cleanup checklist and search results */
                        $scope.details = undefined;
                        $scope.filts = undefined;
                        $scope.query = undefined;
                        $scope.pageSize = null;
                        $scope.currentPage = null;
                        
                        $scope.mySavedStuffQuery = '';
                    };
                    //checks whether an ingredient is already selected or not
                    $scope.checkIfSelected = function(index)
                    {
                        for (var i = 0; i < $scope.checklistIngredients.length; i++)
                        {
                            if ($scope.checklistIngredients[i].id === index)
                            {
                                return true;
                            }
                        }
                        return false;
                    };
                    $scope.addMoreSteps = function()
                    {
                        $scope.stepsToCreateRecipes.length += 1;
                    };
                    // delete selected ingredients for a given recipe while editing
                    $scope.deleteSelectedIngredient = function(element)
                    {
                        if ($scope.ingredientDisplay[element].id !== undefined)
                        {
                            var ingredientIndex = $scope.ingredientDisplay[element].id;
                            recipeService.deleteRecipeIngredient(ingredientIndex)
                                .then(function(response)
                                {
                                    $scope.ingredientDisplay.splice(element, 1);
                                }, function(error)
                                {
                                    console.log(error);
                                });
                        }
                        else
                        {
                            $scope.removeIngs(element);
                        }
                    };
                    $scope.addRecipeIngredModal = function()
                    {
                        $scope.lastChecked = null;
                        $('#add-ingredients-modal')
                            .openModal();
                    };
                    
                    //opens modal to add ingredients/recipes from history
                    $scope.openQuickToolsModal = function(index) {
                        $scope.getMySavedFoods();
                        $('#quick-tools-modal')
                            .openModal();
                    };
                    
                    $scope.removeIngredient = function(element)
                    {
                        // remove ingredient from checklist temp array
                        var index1 = $scope.checklistIngs.indexOf(element);
                        if (index1 >= 0)
                        {
                            $scope.checklistIngs.splice(index1, 1);
                        }
                        // remove ingredient from checklist array
                        //                        var index = $scope.checklistIngredients.filter(function(el) {
                        //                            return el.id === element; // Filter out the appropriate one
                        //                        })
                        var index2 = $scope.checklistIngredients.indexOf(element);
                        if (index2 >= 0)
                        {
                            $scope.checklistIngredients.splice(index2, 1);
                        }
                        // remove ingredient from recipe ingredients
                        var index3 = -1;
                        for (var ind = 0; ind < $scope.ingredientDisplay.length; ind++)
                        {
                            if (element.id === $scope.ingredientDisplay[ind].ingredient.id)
                            {
                                index3 = ind;
                                break;
                            }
                        }
                        if (index3 >= 0)
                        {
                            $scope.ingredientDisplay.splice(index3, 1);
                        }
                    };
                    /* function to remove an ingredient from the recipe */
                    $scope.removeIngs = function(index)
                    {
                        // remove ingredient from checklist array
                        var index2 = -1;
                        for (var i = 0; i < $scope.checklistIngredients.length; i++)
                        {
                            if ($scope.checklistIngredients[i].id === $scope.ingredientDisplay[index].ingredient.id)
                            {
                                index2 = i;
                            }
                        }
                        if (index2 >= 0)
                        {
                            $scope.checklistIngredients.splice(index2, 1);
                        }
                        // remove ingredient from recipe ingredients
                        $scope.ingredientDisplay.splice(index, 1);
                        // remove ingredient from recipe ingredients
                        $scope.AdditionalIngredientInfo.splice(index, 1);
                    };
                    $scope.uploadFile = function(id)
                    {
                        //var file = $scope.recipe_image_file;
                        if ($scope.cropper.croppedImage)
                        {
                            var image_blob = dataURLtoBlob($scope.cropper.croppedImage);
                            var fileName = 'recipe_pic.' + $scope.fileExtn;
                            var file = new File([image_blob], fileName);
                            
                            var url = 'recipes/recipe/' + id + '/';
                            if (file)
                            {
                                recipeService.uploadRecipeImage(file, url);
                            }
                        }
                    };
                    /* function called for saving the recipe */
                    $scope.finalizeRecipeCreation = function($files)
                    {
                        $scope.recipe.directions = '';
                        for (var i = 0; i < $scope.stepsToCreateRecipes.length; i++)
                        {
                            $scope.recipe.directions = $scope.recipe.directions + ' \n' + $scope.stepsToCreateRecipes[i];
                        }
                        $scope.recipe.prep_time = $scope.prepHours + ':' + $scope.prepMins + ':00';
                        $scope.recipe.cook_time = $scope.cookHours + ':' + $scope.cookMins + ':00';
                        updateRecipe($scope.recipe);
                    };
                    $scope.counter = 0;
                    // updates contents of recipes after editing
                    var updateRecipe = function(recipe)
                    {
                        recipeService.updateRecipe(recipe, recipe.id)
                            .then(function(response)
                            {
                                for (var i = 0; i < $scope.ingredientDisplay.length; i++)
                                {
                                    /* create a recipe ingred object to send to server */
                                    (function(cntr_i)
                                    {
                                        if ($scope.ingredientDisplay[i].id === undefined)
                                        {
                                            var recipeIngred = {
                                                recipe: recipe.id,
                                                ingredient: $scope.ingredientDisplay[i].ingredient.id,
                                                measure: $scope.ingredientDisplay[i].measure.id,
                                                quantity: $scope.ingredientDisplay[i].quantity,
                                                description:
                                                $scope.ingredientDisplay[i].description || ''
                                            };
                                            recipeService.createRecipeIng(recipeIngred)
                                                .then(function(response)
                                                {
                                                    //TODO: Add meaningful behaviour
                                                    //    on successful return
                                                    $scope.counter += 1;
                                                    $scope.checkIfCompleted();
                                                }, function(error)
                                                {
                                                    console.log(error);
                                                });
                                            /* upload image file to server upon id creation 
                                           Note: it was easier to do this separately since
                                           the other option was to rewrite sending data in 
                                           a form as opposed to urlencoding it */
                                        }
                                        else
                                        {
                                            recipeService.updateRecipeIngredient($scope.ingredientDisplay[i],
                                                    $scope.ingredientDisplay[i].id)
                                                .then(function(response)
                                                {
                                                    //TODO: Add meaningful behaviour
                                                    //    on successful return
                                                    $scope.counter += 1;
                                                    $scope.checkIfCompleted();
                                                }, function(error)
                                                {
                                                    console.log(error);
                                                });
                                        }
                                    })(i);
                                }
                                /* Redirect to view recipe page */
                            }, function(error)
                            {
                                console.log('recipe could not be created, try again later', error);
                            });
                    };
                    
                    $scope.updateIngredientQuantity = function(index){
                        $scope.ingredientDisplay[index].quantity = parseFloat($scope.ingredientDisplay[index].measure.amount);
                    };
                    
                    $scope.checkIfCompleted = function()
                    {
                        if ($scope.counter === $scope.ingredientDisplay.length)
                        {
                            $scope.uploadFile($scope.recipe.id);
                            $location.path('/recipes/view-recipe/' + $scope.recipe.id);
                        }
                    };
                    
                    /* Nutritional Information calculations based on changes to
                        selected ingredients */

                    $scope.calculateNutritionTotal = function(
                            nutrient) {
                            var total = 0;
                            var servings = parseInt($scope.recipe.servings);
                            //prevent divide by zero
                            if (!servings) {
                                servings = 1;
                            }
                            for (var i = 0; i < $scope.ingredientDisplay
                                .length; i++) {
                                total += parseFloat($scope.ingredientDisplay[
                                        i].ingredient[nutrient]) *
                                    parseFloat($scope.ingredientDisplay[
                                        i].quantity) * parseFloat(
                                        $scope.ingredientDisplay[i]
                                        .measure.weight) /
                                    (100 * servings * parseFloat(
                                        $scope.ingredientDisplay[i]
                                        .measure.amount));
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
                            total += parseFloat($scope.AdditionalIngredientInfo[
                                    i][nutrient]) * parseFloat(
                                    $scope.ingredientDisplay[i]
                                    .quantity) * parseFloat(
                                    $scope.ingredientDisplay[i]
                                    .measure.weight) /
                                (100 * servings);
                        }
                        return total;
                    };
                    
                    $scope.getMySavedFoods = function(page){
                        if(!page){
                            page = 1;
                        }
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
                        console.log(page);
                        if($scope.mySavedStuffQuery.length>0){
                            $scope.searchMySavedStuff(page);
                        }else{
                            $scope.getMySavedFoods(page);
                        }
                    };
                    //end auth check
                }
            });
        }
]);

function dataURLtoBlob(dataurl)
{
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--)
    {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr],
    {
        type: mime
    });
}

function blobToFile(theBlob, fileName)
{
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

function ValidURL(str) {
  if(str.length===0){
      return false;
  }
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  
  if(!pattern.test(str)) {
    return false;
  } else {
    return true;
  }
}