APIREADME.txt

##NOTE, read the official readme.md before reading this
 
 /*SEARCH*/
 127.0.0.1:8000/bitespace/search : Search api, both get and post methods allowed, does not require authenticated user
 GET: 127.0.0.1:8000/bitespace/search?query=butter
 POST: 127.0.0.1:8000/bitespace/search, headers are specified in readme.md, read them! body{
 query=butter&
 }

 /*LOGIN and SIGNUP ARE POST ONLY*/
 127.0.0.1/authentication/api/v1/register/
 127.0.0.1/authentication/api/v1/login/