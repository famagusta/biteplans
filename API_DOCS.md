API DOCS


1)Search ingredients, recipes or plans
    url = /bitespace/search/
    x-www-form-urlencoded

    For Ingredients
        /*POST*/:
        request = {
            query : query_term
            type : ingredients
        }

        response = {
            headers:'',
            data:[array if object],
            status:''	
        }

    For Recipes
    /*POST*/:
        request = {
            query : query_term
            type : recipes
        }

        response = {
            headers:'',
            data:[array if object],
            status:''	
        }
        
        
    For Plans
    /*POST*/:
        request = {
            query : query_term
            type : plans
        }

        response = {
            headers:'',
            data:[array if object],
            status:''	
        }

2)Manual Login(Not social)
    url = /authentication/api/v1/login/
    x-www-form-urlencoded
    
	/*POST*/
	request = {
		email : email,
		password:password
	}

	response = {
		token : token,
	}

	screenshot: loginss.png

##Please note that after recieving token from any kind of authentication, You have to include it in your request headers to be recognized as authenticated
The format to do so is just add the following header to your request
Authorization : JWT <token>


3) Manual registeration/signup
    API for Manual Registration of a user
    
    url = /authentication/api/v1/register/
    (e.g. http://www.bitespacetest.com:8000/authentication/api/v1/register/)
 
    x-www-form-urlencoded
 
	/*POST*/
		request = {
			username: username,
			email : email,
			password:password,
			confirm_password : confirm_password 
		}

	
	response = {
	 200 Ok,
	 data: 'Account created'
	}

	

/* User is not authenticated at this point, instead is asked to confirm his account, so he/she has to click on activation mail sent to them*/

##Social signup

4)url-google-oauth2 = /authentication/sociallogin/social/jwt_user/google-oauth2/',
POST request{
	code:clientID
}


5)url-facebook = '/authentication/sociallogin/social/jwt_user/facebook/',
request{
	code:clientID
}


6) To create a recipes
    url = /biteplans/recipe/recipes/
    x-www-form-urlencoded
    
    /*POST*/
		request = {
			name: reipce_name,
			description : recipe_description
            directions : recipe_directions,
			servings : recipe_servings,
            cook_time : cook_time,
            prep_time : prep_time
            
		}
        
        headers 
        Authorization : JTW <token>
        
7) To retrieve a recipe (by id)
    url = /biteplans/recipe/recipes/{id}/
    x-www-form-urlencoded
    
    no headers or body required
    
8) To create a plan
   url = /biteplans/diet/dietplans/
   x-www-form-urlencoded
   
   /*POST*/
   request = {
          name: plan_name,
          goal: plan_goal,
          description: plan_description,
          duration: duration_weeks,
          age: plan_age,
          gender: plan_gender,
          height: plan_height,
          weight: plan_weight
   }
        
        headers 
        Authorization : JTW <token>

9) To retrieve a plan (by id)
    url = /biteplans/diet/dietplans/{id}/
    x-www-form-urlencoded
    
    no headers or body required
    
10) Get a specific day of a week in the plan
    url = /biteplans/plan/dayplan/{diet_id}/{day_no}/{week_no}/
    x-www-form-urlencoded
    
    no headers or body required

11) Get a specific day of a week in the plan
    url = /biteplans/plan/dayplan/{diet_id}/{day_no}/{week_no}/
    x-www-form-urlencoded
    
    no headers or body required

    you will get all meal plans of that day