/* global app, $, console */

app.controller('shortlistedIngredientsController', ['$scope', '$window', '$location',
    'AuthService', 'searchService', 'summaryService',
    function($scope, $window, $location, AuthService, searchService,
        summaryService) {
        'use strict';
        
    	$scope.openModal ={};
        $scope.selected = 0;
        $scope.ingredientSelected = {};

    	$scope.getMyIngredients = function(page){

    		summaryService.getShortlistIngredients(page).then(function(response){
    			$scope.myIngredients = response.results;
                $scope.currentPage = page;
                $scope.pageSize = response.total*6;
                
               // getAdditionalIngredientInformation($scope.myIngredients);
    		}, function(error){
    			console.log(error);
    		});
    	};

    	$scope.getMyIngredients();

    	$scope.openIngredientsModal = function(myIngredient){
            
            // function for modal when ingredient card is clicked
            $scope.ingredientSelected = {};
            

            var ingredientMatch = $scope.myIngredients.filter(
                function(el)
                {
                    return el.ingredient.id === myIngredient.ingredient.id;
            });
            var index = findWithAttr($scope.myIngredients,
                'id', ingredientMatch[0].id);
            
            
            $scope.myIngredients[$scope.selected].additionalIngredientInfo = {};
            
            searchService.get_ingredient_addtnl_info($scope.myIngredients[index].ingredient.id)
                .then(function(response){
                    $scope.selected = index;
                    $scope.myIngredients[$scope.selected].additionalIngredientInfo =
                        response;
                    
                    // modal must only initialize after additionalingredient info is retrieved
                    $scope.ingredientSelected = $scope.myIngredients[$scope.selected];
                    $scope.ingredientSelected.selectedMeasure =
                        $scope.ingredientSelected.ingredient.measure[0];
                    $('#modal6').openModal();
                }, function(error){
                
            });
             
    	};

        
        $scope.removeIngredient = function(index){
            searchService.removeFromMyIngredients($scope.myIngredients[index].id).then(function(response){
                $scope.myIngredients.splice(index,1);
            }, function(error){
                console.log(error);
            });
        };
        
    	$scope.calculateIngredientInfo = function(nutrient, isAdditional) {
                var total=0;
                if(isAdditional){
                    
                    total += $scope.myIngredients[$scope.selected]
                        .additionalIngredientInfo[nutrient] * $scope.ingredientSelected.selectedMeasure.weight/100;
                   
                } else {
                    total += $scope.myIngredients[$scope.selected]
                    .ingredient[nutrient] * $scope.ingredientSelected.selectedMeasure.weight/100;
                }
            return total;
        };
    }]);


app.controller('shortlistedRecipesController', ['$scope', '$window', '$location',
    'AuthService', 'recipeService', 'summaryService',
    function($scope, $window, $location, AuthService, recipeService,
        summaryService) {
        'use strict';
        
        $scope.currentPage=1;
        $scope.currentPageRecipe=1;
    	$scope.getRecipesMadeByMe = function(page){
    		recipeService.getRecipesMadeByMe(page).then(function(response){
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

    	$scope.getMyRecipes = function(page){
    		summaryService.getShortlistRecipes(page).then(function(response){
    			$scope.myRecipes = response.results;
                $scope.currentPage = page;
                $scope.pageSize = response.total*3;
                for(var i=0;i<$scope.myRecipes.length;i++){
                    if($scope.myRecipes[i].recipe.image){
                        $scope.myRecipes[i].myRecipesImage = $scope.myRecipes[i].recipe.image;
                    }
                    else {
                        $scope.myRecipes[i].myRecipesImage = 'static/images/default_recipe.png';
                    }
                }

    		}, function(error){
    			console.log(error);
    		});
    		
    	};
    	$scope.getMyRecipes(1);
        $scope.getRecipesMadeByMe(1);
        
        $scope.getRecipeRating = function(recipe)
        {
            return recipe.recipe.average_rating * 20;
        };
        
        $scope.getTotalDuration = function(recipe){
            /* return total time : cook + prep of a recipe */
            var cook_time = moment.duration(recipe.cook_time);
            var prep_time = moment.duration(recipe.prep_time);
            var tot_time = moment.duration(cook_time + prep_time);
            return tot_time.hours() + " hour " + tot_time.minutes() + " mins" ;
        };
    }]);



app.controller('shortlistedPlansController', ['$scope', '$window', '$location',
    'AuthService', 'planService', 'summaryService',
    function($scope, $window, $location, AuthService, planService,
        summaryService) {
        'use strict';
        
        $scope.userPlanRatings = [];
        var getUserPlanRatings = function()
        {
            planService.getUserDietPlanRatings().then(function(
                response)
            {
                $scope.userPlanRatings = response;
            }, function(error)
            {
                console.log(error);
            });
        };
        
        $scope.currentPageCreatedPlans=1;
        $scope.pageSizeCreatedPlan=1;
        
        $scope.currentPageSavedPlans=1;
        $scope.pageSizeSavedPlan=1;
        
        $scope.getPlansMadeByMe = function(page){
            
            planService.getPlansMadeByMe(page).then(function(response){
                $scope.createdPlans = response.results;
                $scope.currentPageCreatedPlans = page;
                $scope.pageSizeCreatedPlan = response.total*2;
            }, function(error){
                console.log(error);
            });
        };
        
        $scope.getPlanNutrientPercent = function(plan, nutrient)
        {
            var conversion_factor = 4;
            if (nutrient === 'fat_tot')
            {
                conversion_factor = 9;
            }
            var nutrient_percent = 100 * conversion_factor *
                parseFloat(plan[nutrient]) / parseFloat(plan.energy_kcal);
            return nutrient_percent;
        };

        $scope.getPlanRating = function(plan)
        {
            // bind result to results array
            var planRatingMatch = $scope.createdPlans.filter(
                function(el)
                {
                    return el.id === plan.id;
                });
            var idxDietPlan = findWithAttr($scope.createdPlans.results,
                'id', planRatingMatch[0].id);
            return $scope.createdPlans[idxDietPlan]
                .average_rating * 20;
        };
        
        $scope.removePlan = function(planId){
            planService.removePlanFromShortlist(planId).then(function(response){
                $scope.getMyPlans(1);
            }, function(error){
                console.log(error);
            });
        };
        
        $scope.openPlanDetails = function(planId){
            $location.path('/dietplans/view-diet-plan/' + planId +'/');
        };
        
        $scope.setPlanRating = function(plan, rating)
        {
            /* Handle following cases
                1. user sets rating for a plan for the 1st time
                2. user updates rating for a plan he rated before
                    2.a. user tries to set same rating as before
                3. the function is triggered by extra firing of 
                    star input directive -- FIX this is future
                must also check if user is logged in to do this
            */
            var normalizedRating = Math.ceil(rating / 20);
            var ratingObject = {
                rating: normalizedRating,
                dietPlan: plan.id
            };
            
            // only authenticated users must rate plans
            if (normalizedRating > 0)
            {
                // this takes care of erroneous firing of function
                // find if user has rated this plan before - decide b/w post & patch
                var userRatingMatch = $scope.userPlanRatings.filter(
                    function(el)
                    {
                        return el.dietPlan === plan.id;
                    });
                // find index of diet plan in results - we need to update it 
                var idxDietPlan = findWithAttr($scope.plans.results,
                    'id', userRatingMatch[0].dietPlan);
                if (userRatingMatch.length > 0)
                {
                    // case where user has previously rated this plan
                    if (userRatingMatch[0].rating !==
                        normalizedRating)
                    {
                        //case where user is updating his/her rating
                        planService.updateDietPlanRating(
                            ratingObject, userRatingMatch[0]
                            .id).then(function(response)
                        {
                            //update user ratings array
                            getUserPlanRatings();
                            // update dietplan rating
                            var plan2Update = {};
                            planService.getDietPlan(userRatingMatch[0].dietPlan)
                                .then(function(response){
                                    $scope.plans.results[idxDietPlan] = response;
                            }, function(error){
                                console.log(error);
                            });
                        }, function(error)
                        {
                            console.log(error);
                        });
                    }
                }
                else
                {
                    // case where this is a fresh rating
                    planService.createDietPlanRating(ratingObject).then(function(response) {
                        // update user ratings array
                        getUserPlanRatings();
                    }, function(error)
                    {
                        console.log(error);
                    });
                }
            }
            
        };
        
        
        $scope.getMyPlans = function(page){
            summaryService.getShortlistPlans(page).then(function(response){
                $scope.myPlans = response.results;
                $scope.currentPageSavedPlans = page;
                $scope.pageSizeSavedPlan = response.total*2;

            }, function(error){
                console.log(error);
            });
        };
        
        $scope.getPlansMadeByMe(1);
        $scope.getMyPlans(1);
    }]);

function findWithAttr(array, attr, value){
    for (var i = 0; i < array.length; i += 1)
    {
        if (array[i][attr] === value)
        {
            return i;
        }
    }
}