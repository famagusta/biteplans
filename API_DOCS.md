##API DOCS

##Search
1) url = /bitespace/search/

	Note: This is subject to be changed whilst the development of the project to accomodate search for different models

	/*GET*/:
	/search/?query=term/


	/*POST*/:
	request = {

		query : ""

	}

	response = {
		headers:'',
		data:[array if object],
		status:''	
	}

	screenshot: searchss.png

##Manual Login(Not social)
2) url = /authentication/api/v1/login/

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


##Manual registeration/signup
3) url = /authentication/api/v1/register/
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

	screenshot: registerss.png

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



