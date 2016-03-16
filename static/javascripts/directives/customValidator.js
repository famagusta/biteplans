'use strict';
app.directive('customValidator', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.myForm.registerPassword.$viewValue
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
});

app.filter('addSpace', function () {
   return function (input) {

   	return input.replace(/,/g,', ');
      //your date parser here
   };
});