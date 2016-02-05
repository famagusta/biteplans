'use strict';
app.factory('authInterceptor', ['$rootScope', '$q', 'window', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('username');
        $location.path('/');
        return;
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
}]);

/*When to use the authInterceptor config */
app.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
}]);


// app.service('httpService' , [ '$q', '$http', function($q, $http){
//   return {
//     /**
//      * Aborts old request and makes room for new request
//      * 
//      * Example usage : 
//      * gPlusLoginRequestHandlers = { 'inRequest' : null , 'requestCanceler' : null }
//      *    var url = 'loginUserWithGPlus';
//         var param = "gPlusUserDtoString=" + encodeURIComponent(angular.toJson(gPlusUserDto));
//         gPlusLoginRequestHandlers = httpService.httpCallWithAbort(url, param, gPlusLoginRequestHandlers);
//         gPlusLoginRequestHandlers['inRequest'].success(function(data) {
//           gPlusLoginRequestHandlers['inRequest'] = null;
//           // Add actions on success
//         });
//         gPlusLoginRequestHandlers['inRequest'].error(function(data, status) {
//           if (status != 0) {
//             gPlusLoginRequestHandlers['inRequest'] = null;
//             // Add here actions that need to be taken on error
//           }
//         });
//      */
//     httpCallWithAbort : function(url, param, requestHandlers) {
//       if (requestHandlers['inRequest'] != null) {
//         requestHandlers['requestCanceler'].resolve(); 
//       };
//       requestHandlers['requestCanceler'] = $q.defer();
//       requestHandlers['inRequest'] =
//       $http({
//         method  : 'POST',
//         url     : url,
//         headers : {
//           'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
//           'Cache-Control' : 'max-age=31536000'  
//         },
//         data : param,
//         timeout : requestHandlers['requestCanceler'].promise
//       });
//       return requestHandlers;
//     },
//     /**
//      * Stops multiple calls till old request is completed
//      * 
//      * @param url
//      * @param param
//      * @param requestHandlers
//      * @returns
//      */
//     httpCallWithWait : function(url, param, requestHandlers) {
//       if (requestHandlers['inRequest'] == 0 ) {
//         requestHandlers['inRequest'] = 1;
//         // $http returns a promise, which has a then function, which also returns a promise
//            var promise = $http({method : 'POST',
//             url : url,
//             headers : {
//               'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
//               'Cache-Control' : 'max-age=31536000'
//             },
//             data : param
//          }).then(function (response) {
//            requestHandlers['inRequest'] = 0;
//            return response.data;
//            });
//            // Return the promise to the controller
//            return promise;
//       };
//       if (requestHandlers['inRequest'] == 1 ) {
//         requestHandlers['inRequest'] = 2;
//         // $http returns a promise, which has a then function, which also returns a promise
//            var promise = $http({method : 'POST',
//             url : url,
//             headers : {
//               'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
//               'Cache-Control' : 'max-age=31536000'
//             },
//             data : param
//          }).then(function (response) {
//            requestHandlers['inRequest'] = 0;
//            return response.data;
//            });
//            // Return the promise to the controller
//            return promise;
//       };
//     },
//     /**
//      * Stops multiple calls till old request is completed
//      * 
//      * @param url
//      * @param param
//      * @param requestHandlers
//      * @returns
//      */
//     httpGetCallWithWait : function(url, param, requestHandlers) {
//       if (requestHandlers['inRequest'] == 0 ) {
//         requestHandlers['inRequest'] = 1;
//         // $http returns a promise, which has a then function, which also returns a promise
//            var promise = $http({method : 'GET',
//             url : url,
//             headers : {
//               'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
//               'Cache-Control' : 'max-age=31536000'
//             },
//             data : param
//          }).then(function (response) {
//            requestHandlers['inRequest'] = 0;
//            return response.data;
//            });
//            // Return the promise to the controller
//            return promise;
//       };
//       if (requestHandlers['inRequest'] == 1 ) {
//         requestHandlers['inRequest'] = 2;
//         // $http returns a promise, which has a then function, which also returns a promise
//            var promise = $http({method : 'POST',
//             url : url,
//             headers : {
//               'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
//               'Cache-Control' : 'max-age=31536000'
//             },
//             data : param
//          }).then(function (response) {
//            requestHandlers['inRequest'] = 0;
//            return response.data;
//            });
//            // Return the promise to the controller
//            return promise;
//       }
//     }
//   };
// }]);
