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

app.directive('materialSelect', function() {
   return {
      restrict: 'A',
      link: function(scope, elem) {
         $(elem).material_select();
      }
   };
});


app.directive('clickAnywhereButHere', ['$document', function ($document) {
        var directiveDefinitionObject = {
            link: {
                pre: function (scope, element, attrs, controller) { },
                post: function (scope, element, attrs, controller) {
                    var onClick = function (event) {
                        var isChild = element.has(event.target).length > 0;
                        var isSelf = element[0] === event.target;
                        var isInside = isChild || isSelf;
                        if (!isInside) {
                            scope.$apply(attrs.clickAnywhereButHere);
                        }
                    };
                    $document.click(onClick);
                }
            }
        };
        return directiveDefinitionObject;
    }]);

app.directive('contenteditable', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind('blur keyup change', function() {
        scope.$apply(read);
      });
    }
  };
});