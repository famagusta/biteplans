'use strict';
/* global app */
/*global $*/

app.directive('customValidator', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.myForm.registerPassword.$viewValue;
                ctrl.$setValidity('noMatch', !noMatch);
            });
        }
    };
});

app.filter('addSpace', function () {
   return function (input) {

   	return input.replace(/,/g,', ');
      //your date parser here
   };
});

app.filter('num', function() {
    return function(input) {
      return parseInt(input, 10);
    };
});

//app.directive('materialSelect', function() {
//   return {
//      restrict: 'A',
//      link: function(scope, elem) {
//         $(elem).material_select();
//      }
//   };
//});

// this works
app.directive("materialSelectDefunct", ["$compile", "$timeout", function ($compile, $timeout) {
            return {
                link: function (scope, element, attrs) {
                    if (element.is("select")) {
						//BugFix 139: In case of multiple enabled. Avoid the circular looping.
                        function initSelect(newVal, oldVal) {                            
                            if(attrs.multiple){
                                if(oldVal !== undefined && newVal !== undefined){
                                  if(oldVal.length === newVal.length){
                                      return;
                                  }
                                }
                                var activeUl = element.siblings("ul.active");
                                if (newVal !== undefined && activeUl.length) { // If select is open
                                    var selectedOptions = activeUl.children("li.active").length; // Number of selected elements
                                    if (selectedOptions == newVal.length) {
                                        return;
                                    }
                                }
                            } else {
                                if (newVal == element.val()){
                                    return;
                                }
                            }
                            element.siblings(".caret").remove();
                            scope.$evalAsync(function () {
                                //element.material_select();
                                //Lines 301-311 fix Dogfalo/materialize/issues/901 and should be removed and the above uncommented whenever 901 is fixed
                                element.material_select(function () {
                                    if (!attrs.multiple) {
                                        $('input.select-dropdown').trigger('close');
                                    }
                                });
                                var onMouseDown = function (e) {
                                    // preventing the default still allows the scroll, but blocks the blur.
                                    // We're inside the scrollbar if the clientX is >= the clientWidth.
                                    if (e.clientX >= e.target.clientWidth || e.clientY >= e.target.clientHeight) {
                                        e.preventDefault();
                                    }
                                };
                                element.siblings('input.select-dropdown').on('mousedown', onMouseDown);
                            });
                        }
                        $timeout(initSelect);
                        if (attrs.ngModel) {
                            scope.$watch(attrs.ngModel, initSelect);
                        }
                        if ("watch" in attrs) {
                            scope.$watch(function () {
                                return element[0].innerHTML;
                            }, function (oldVal, newVal) {
                                if (oldVal !== newVal) {
                                    $timeout(initSelect);
                                }
                            });
                        }
                    }
                }
            };
        }]);

app.directive('carouselEffect', function() {
   return {
      restrict: 'A',
      link: function(scope, elem) {
         $(elem).carousel();
      }
   };
});

app.directive('dropdownButton', function() {
   return {
      restrict: 'A',
      link: function(scope, elem) {
         $(elem).dropdown({
                    belowOrigin: true, 
                    alignment: 'left', 
                    inDuration: 200,
                    outDuration: 150,
                    constrain_width: false,
                    hover: false, 
                    gutter: 1
                  });
      }
   };
});

app.directive('adjustPlaceholder', function() {
    return{
        restrict: 'A',
        link: function(scope, elem) {
            $(elem).addClass('active');
        }
    };
});

app.directive('fireEnter', function() {
    return {
        restrict: 'A',
        link: function(scope, elem) {
          $("textarea#searchbox").keypress(function (e) { // fire search results on pressing enter key
                if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                    $(elem).click();
                    return false;
                } else {
                    return true;
                }
            });
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