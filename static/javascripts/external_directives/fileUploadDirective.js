/* global app */

app.directive('ngFiles', ['$parse', function ($parse) {
    'use strict';
    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on('change', function (event) {
            onChange(scope, { $files: event.target.files });
        });
    }

    return {
        link: fn_link
    };
}]);

app.directive('fileModel', ['$parse', function ($parse) {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


app.directive('ngModel', function( $filter ) {
    'use strict';
    return {
        require: '?ngModel',
        link: function(scope, elem, attr, ngModel) {
            if( !ngModel )
                return;
            if( attr.type !== 'time' )
                return;
                    
            ngModel.$formatters.unshift(function(value) {
                return value.replace(':\d{2}[\.\,]\d{3}$', '');
            });
        }
    };   
});