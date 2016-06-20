/* global app, $ */


app.controller('footerController', ['$scope', function($scope){
    $scope.openAboutModal = function() {
        $('#about-modal').openModal();
    };
    
    $scope.openContactModal = function() {
        $('#contact-modal').openModal();
    };
}]);