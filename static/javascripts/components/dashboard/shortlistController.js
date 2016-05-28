'use strict';
app.controller('shortlistedIngredientsController', ['$scope', '$window', '$location',
    'AuthService', 'searchService', 'summaryService',
    function($scope, $window, $location, AuthService, searchService,
        summaryService) {

    	$scope.openModal ={}

    	var getMyIngredients = function(page){

    		summaryService.getShortlistIngredients(page).then(function(response){
    			$scope.myIngredients = response.results;
                $scope.currentPage = page;
                $scope.pageSize = response.total*6;
    		}, function(error){
    			console.log(error);
    		});
    	};

    	getMyIngredients();

    	$scope.openIngredientsModal = function(index){
    		$('#modal6').openModal();
    		$scope.openModal.measure = $scope.myIngredients[index].ingredient.measure[0];
    		$scope.selected = index;
    	};

    	$scope.calculateIngredientInfo = function(nutrient) {
                var total=0;
                
                total += $scope.myIngredients[$scope.selected].ingredient[nutrient]
                    * $scope.openModal.measure.weight;
            
            return total;
        };
    }]);


app.controller('shortlistedRecipesController', ['$scope', '$window', '$location',
    'AuthService', 'recipeService', 'summaryService',
    function($scope, $window, $location, AuthService, recipeService,
        summaryService) {
        $scope.currentPage=1;
        $scope.currentPageRecipe=1;
    	var getRecipesMadeByMe = function(page){

    		recipeService.getRecipesMadeByMe(page).then(function(response){
                console.log(response);
    			$scope.createdRecipes = response.results;
                $scope.currentPageRecipe = page;
                $scope.pageSizeRecipe = response.total*3;
                for(var i=0;i<$scope.createdRecipes.length;i++){
                    if($scope.createdRecipes[i].image){
                        $scope.createdRecipes[i].myRecipesImage = $scope.createdRecipes[i].image;
                        
                    }
                    else {
                        $scope.createdRecipes[i].myRecipesImage = 'static/images/default_recipe.png';
                    }
                }
    		}, function(error){
    			console.log(error);
    		});
    	};

    	var getMyRecipes = function(page){
    		summaryService.getShortlistRecipes(page).then(function(response){
    			$scope.myRecipes = response.results;
                $scope.currentPage = page;
                $scope.pageSize = response.total*3;
                $scope.currentPage = page;
                $scope.pageSize = response.total*3;
                for(var i=0;i<$scope.myRecipes.length;i++){
                    if($scope.myRecipes[i].image){
                        $scope.myRecipes[i].myRecipesImage = $scope.myRecipes[i].image;
                        
                    }
                    else {
                        $scope.myRecipes[i].myRecipesImage = 'static/images/default_recipe.png';
                    }
                }

    		}, function(error){
    			console.log(error);
    		});
    		getRecipesMadeByMe(1);
    	};
    	getMyRecipes(1);
    }]);



