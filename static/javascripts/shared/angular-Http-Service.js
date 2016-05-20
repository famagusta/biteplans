'use strict';
app.factory('authInterceptor', ['$rootScope', '$q', '$window', function($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.localStorage.token) {
        config.headers.Authorization = 'JWT ' + $window.localStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('username');
        return;
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
}]);