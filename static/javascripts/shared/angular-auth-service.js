/*Handles request to user registration, login, logout*/
/* global app */

// $q makes a promise which can be fulfilled or not fulfilled. so a = $q.defer(), it can resolve or reject
//a.resolve() means success, a.reject() means not fulfilled

app.factory('httpService', ['$http', '$q',
    function ($http, $q) {
        'use strict';
        //encodes params into correct format 
        var toparams = function (obj) {
            var p = [];
            for (var key in obj) {
                p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
        };
        //makes a post using url and params as parameter
        var httpPost = function (url, params) {
            params = toparams(params);
            var promise = $http.post(url, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(
                    function (response) {
                        return response.data;
                    });
            return promise;
        };

        var httpPut = function (url, params) {
            params = toparams(params);
            var promise = $http.put(url, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(
                    function (response) {
                        return response.data;
                    });
            return promise;
        };

        var httpPatch = function (url, params) {
            params = toparams(params);
            var promise = $http.patch(url, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(
                    function (response) {
                        return response.data;
                    });
            return promise;
        };
        
        //httpPatch to upload photos in forms
          var httpPatchFile = function (url, fd) {
            var promise = $http.patch(url, fd,
                    {
                        headers: {
                        'Content-Type': undefined
                    }
                }).then(
                    function (response) {
                        return response.data;
                    });
            return promise;
        };

        //http get method wrapper
        var httpGet = function (url) {
            var promise = $http.get(url, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(
                    function (response) {
                        return response.data;
                    });
            return promise;
        };

        var httpDelete = function (url) {
            var promise = $http.delete(url, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(
                    function (response) {
                        return response.data;
                    });
            return promise;
        };

        return {
            httpPost: function (url, params) {
                return httpPost(url, params);
            },
            httpGet: function (url, params) {
                return httpGet(url, params);
            },
            httpPatchFile: function (url, fd) {
                return httpPatchFile(url, fd);
            },
            httpPut: function (url, params) {
                return httpPut(url, params);
            },
            httpPatch: function (url, params) {
                return httpPatch(url, params);
            },
            httpDelete: function (url, params) {
                return httpDelete(url, params);
            },
        };
    }
]);

/* Takes care of authentication functionality and also stores user object for sharing among different controllers*/
app.factory('AuthService', ['httpService', '$location', 'constants', '$q',
    '$window', '$rootScope', '$auth',
    function (httpService, $location, constants, $q, $window, $rootScope,
        $auth) {
        'use strict';
        
        var register = function (username, password, confirm, email) {
            // Registration logic goes here

            //constants is a angular.constant service which will contain all the constants for our app
            //being used 
            var deferred = $q.defer();
            var url = '/authentication/api/v1/register/';
            var userString = {
                'username': username,
                'password': password,
//                'confirm_password': confirm,   
                // this is giving an invalid serializer 500 error
                'email': email
            };

            httpService.httpPost(url, userString)
                .then(
                    function (response) {
                        if (response.success) {
                            deferred.resolve(response);
                        }
                        else {
                            deferred.reject(response);
                        }
                    },
                    function (error) {
                        deferred.reject(error);
                    });
            return deferred.promise;
        };

        /* Login logic goes here {This is normal login, not social login }*/
        var login = function (username, password) {
            var url = '/authentication/api/v1/login/';
            var deferred = $q.defer();
            httpService.httpPost(url, {
                    'email': username,
                    'password': password,
                })
                .then(
                    function (response) {
                        var token = response.token;
                        if (token) {
                            $window.localStorage.token = token;
                            constants.userOb.pk = response.id;
                            constants.userOb.status = true;
                            deferred.resolve(response);
                            
                        }
                        else {
                            // error callback
                            deferred.reject(
                                'Invalid data received from server'
                            );
                            $auth.removeToken();

                        }
                    },
                    function (response) {
                        deferred.reject(response);
                        $auth.removeToken();

                    });
            return deferred.promise;
        };



        /* function to logout for normally signed in user */
        var logout = function () {
            $auth.removeToken();
            constants.userOb = {};

        };

        /* function to update a user profile */
//        var updateProfile = function (args, id) {
//            var url = '/authentication/api/v1/register/' + id + '/';
//        };
        
        /*User resource for sharing between different controllers */
        // I think this doesnt work anumore
//        var userOb = {};
//        userOb.current = {};
//        constants.userOb.set_user = function (response) {
//            if (response) {
//                constants.userOb.current = response.data;
//            }
//            else {
//                constants.userOb.current = {
//                    'username': null,
//                    'first_name': null,
//                    'last_name': null,
//                    'email': null,
//                    'social_thumb': '{% static "anonymous.png" %}'
//                };
//            }
//        };

        /*Function for social login */
        var loginSocial = function (provider) {
            var prom = $q.defer();
            $auth.authenticate(provider)
                .then(function (response) {
                    $auth.setToken(response.data.token);
//                    constants.userOb.set_user(response);
                    constants.userOb.pk = response.data.id;
                    constants.userOb.status = true;
                    prom.resolve(response.data);
                })
                .catch(function (data) {
                    logout();
                    prom.reject(
                        'Something went wrong, try again later'
                    );
                    constants.userOb = {};
                });

            return prom.promise;
        };

        //stores the info of current user to share amongst different controllers.
        // I think this doesnt work anymore
        var getCurrentUserDetails = function () {
            if ($auth.getToken()) {
                httpService.httpGet(
                       '/authentication/api/v1/jwt_user/'
                    )
                    .then(function (response) {
                        constants.userOb.pk = response.id;
                        constants.userOb.status = true;
                        //return UserOb;
                    });
            }
        };

        //Function for forgot password and this sends email to user with activation link
        var resetPassword = function (email) {
            //url to be hit
            var url = '/authentication/forgot/password/reset/';
            //promise to be fulfilled
            var deferred = $q.defer();
            httpService.httpPost(url, {
                    'email': email,
                })
                .then(
                    function (response) {
                        //promise is fulfilled
                        deferred.resolve(response.data);

                    },
                    function (response) {
                        //error, promise not fulfilled :(
                        deferred.reject(response.data);

                    });
            //return promise, promise gets things done
            return deferred.promise;
        };


        var isAuthenticated = function () {
            var url = '/authentication/loginstatus/';
            var deferred = $q.defer();
            httpService.httpGet(url)
                .then(function (response) {
                    constants.userOb.status = response.status;
                    constants.userOb.pk = response.pk;
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        //return all these features as function
        return {
            register: function (username, password, confirm, email) {
                return register(username, password, confirm, email);
            },
            login: function (username, password) {
                return login(username, password);

            },
            logout: function () {
                logout();
//                location.reload(); 
                return 'User has been logged out';

            },
            isAuthenticated: function () {
                return isAuthenticated();
            },

            socialAuth: loginSocial,

            getAuthdUser: getCurrentUserDetails,

            forgotPassword: resetPassword
        };
    
}]);