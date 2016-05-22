'use strict';
app.controller('shortlistedIngredientsController', ['$scope', '$window', '$location',
    'AuthService', 'searchService', 'summaryService',
    function($scope, $window, $location, AuthService, searchService,
        summaryService) {

    	$scope.openModal ={}

    	var getMyIngredients = function(){

    		summaryService.getShortlistIngredients().then(function(response){

    			console.log(response);

    			$scope.myIngredients = response;

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
                
                total += $scope.myIngredients[$scope.selected].ingredient[nutrient] * $scope.openModal.measure.weight;
            
            return total;
                
        
        };


    }]);




app.controller('shortlistedRecipesController', ['$scope', '$window', '$location',
    'AuthService', 'recipeService', 'summaryService',
    function($scope, $window, $location, AuthService, recipeService,
        summaryService) {
    	var getRecipesMadeByMe = function(){

    		recipeService.getRecipesMadeByMe().then(function(response){
                console.log(response);
    			$scope.createdRecipes = response;
                
                for(var i=0;i<$scope.createdRecipes.length;i++){
                    if($scope.createdRecipes[i].image){
                        $scope.myRecipesImage = $scope.createdRecipes[i].image;
                    }
                    else {
                        $scope.myRecipesImage = 'static/images/default_recipe.png';
                    }
                }

    		}, function(error){

    			console.log(error);

    		});

    	};

    	var getMyRecipes = function(){

    		summaryService.getShortlistRecipes().then(function(response){

    			$scope.myRecipes = response;
                console.log(response);

    		}, function(error){

    			console.log(error);

    		});


    		getRecipesMadeByMe();

    	};

    	getMyRecipes();

    	


    	










    }]);



