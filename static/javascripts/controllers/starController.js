'use strict';
app.controller('starController', function($scope) {    

    $scope.stars = [1,2,3,4,5];
    
});

app.filter('reverse', function() {
    return function(items) {
    return items.slice().reverse();
  };
});
