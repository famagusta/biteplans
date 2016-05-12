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

##Please note that after recieving token from any kind of authentication, You have to include 
it in your request headers to be recognized as authenticated
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

	

/* User is not authenticated at this point, instead is asked to confirm his account, 
so he/she has to click on activation mail sent to them*/

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
        Authorization : JTW <token> //this is automatically added in web

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
        
        headers : {
            Authorization: JWT <token> //this is automatically added in web
        }


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
    
12) to retrieve additional nutrition info 
    url = /biteplans/ingredient/1123/
    
13) To upload an image of a recipe
    url = /biteplans/recipe/recipes/{recipe_id}/
    patch method only, send information as 
    content type is automatically determined by the the browser
    formdata with header:
    header:{
        Content-Type : undefined
        Authorization: JWT <token> //this is automatically added in web
    }
    
14) to get a user's profile with just the token
    url = /authentication/api/v1/jwt_user/
    GET
    with headers
    header :{
        Authorization: JWT <token>
    }
    
    
15) To upload a user's picture 
    url = /authentication/api/v1/register/{id}/
    PATCH
    with headers
    header :{
        Content-Type : undefined
        Authorization: JWT <token>
    }
    
    content type is automatically determined by the the browser
    
    for angular - need to encode the file into a form data to send 
    it . check httpPatchFile in angular-auth-service.js
    

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
request : url /biteplans/calendar/getPlanSummary/?date=yyyy-mm-dd
response :{
    "count": 0,
    "next": null,
    "previous": null,
    "results": [

    {followed_plan_details that need to be done on this date with ingredients and recipes}

    ]
}

13)##Log meal history
request : url /biteplans/calendar/getPlanSummary/
/*GET ONLY*/
request : url /biteplans/calendar/getPlanSummary/?date=yyyy-mm-dd
data ={
  name:<name>,
  date:<date>,(yyyy-mm-dd)
  time:hh:mm:ss}


response :{
    mealhistory_id:pk
}

delete, patch api would like before, just send primary key in the url as
url : url /biteplans/calendar/getPlanSummary/pk

and httpdelete for delete, httppatch for update with required fields


14)##Event Ingredient
##API made by robin doc to be done by robin
/*POST*/
{
meal_history:<pk>,
meal_ingredient:<pk>,
unit_desc:<pk>,
quantity:<int>,
is_checked:<boolean>

}


15) Shortlisting ingredient and recipe
url /biteplans/calendar/myingredients(for ingredients)
url /biteplans/calendar/myrecipes(for recipes)

##POST
request for shortlisting ingredients {
  meal_ingredient: <pk of ingredient> 
}
##POST
request for shortlisting recipes {
  meal_recipe:<pk of recipe>
}

###for unfollow

##Delete
httpDelete,
url /biteplans/calendar/myingredients/pk/(for ingredients)
url /biteplans/calendar/myrecipes/pk/(for recipes)