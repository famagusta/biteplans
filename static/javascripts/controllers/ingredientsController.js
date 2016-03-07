app.controller('ingredientsController', ['$scope', 'AuthService', '$http', function ($scope, AuthService, '$http') {
    $scope.searchResult = AuthService.search();
}]);