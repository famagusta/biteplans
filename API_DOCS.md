API DOCS


1)Search ingredients, recipes or plans

    /*POST REQUEST*/
    url = /bitespace/search/?page=int
    x-www-form-urlencoded

    For Ingredients
        /*POST*/:
        request = {
            query : query_term
            type : ingredients
            food_group:[array of food_group filters] //If only filters are applicable
            sortby:sortby //if only sortby are there
        }

        response = {
            headers:'',
            result:[array if object](will contain 6 instances),
            status:'',
            total:int(number of pages),
            sortl:[] //list of sortby applicable
            filter:[] //list of filters applicable	
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


6) a) To create a recipes
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

    b)UPDATE:

        i) /*PUT ALLOWED FOR ONLY CREATOR OF RECIPE and used for COMPLETE UPDATE*/
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

        ii) /*PATCH ALLOWED FOR ONLY CREATOR OF RECIPE and used for COMPLETE UPDATE*/
        request = {
            <field _to_be_updated>:'value'
            
        }
        
        headers 
        Authorization : JTW <token>

    c) /* DELETE (ALLOWED FOR ONLY OWNER OF RECIPE)*/
        append instance pk to the url url = /biteplans/recipe/recipes/<pk>
        
        headers 
        Authorization : JTW <token>

        make a delete method request


        
7) To retrieve a recipe (by id)

    /* GET ONLY */
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


        /*PUT for total update*/
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

        /*PATCH for partial update*/
   request = {
          field: value
   }
        
        headers 
        Authorization : JTW <token>

9) To retrieve a plan (by id)

    /* GET ONLY */
    url = /biteplans/diet/dietplans/{id}/
    x-www-form-urlencoded
    
    no headers or body required
    

10) Get a specific day of a week in the plan:

    /*GET ONLY*/
    url = /biteplans/plan/dayplan/{diet_id}/{day_no}/{week_no}/
    x-www-form-urlencoded
    
    no headers or body required

    you will get all meal plans of that day

11) API TO FOLLOW PLANS

 url = /biteplans/calendar/follow/
 /*POST*/
 request = {
          start_date: yyyy-mm-dd,
          is_active:true/false,
          dietplan :<pk> of dietplan to be followed
   }

   response={
   <pk>:pk of followed dietplan entry
   }

12)API TO GET SCHEDULE OF A DAY OF USER

/*GET ONLY*/
request : url /biteplans/calendar/getPlanSummary/?date=yyy-mm-dd
response :{
    "count": 0,
    "next": null,
    "previous": null,
    "results": [

    {followed_plan_details that need to be done on this date with ingredients and recipes}

    ]
}

