'use strict';

describe('Testing Routes', function() {
    beforeEach(module('biteApp'));
    
    var location, route, rootScope;
    
    beforeEach(inject(
        function(_$location_, _$route_, _$rootScope_) {
            location = _$location_;
            route = _$route_;
            rootScope = _$rootScope_;
        }));
    
    beforeEach(inject(
        function($httpBackend) {
            $httpBackend.expectGET('static/templates/landingPage.html').respond(200, 'main HTML');
        }));
    
    it('should load landing page on successful load of /', function() {
        expect($location.path()).toBe('');
        $location.path('/');
        $rootScope.$digest();
        
        expect($location.path()).toBe( '/' );
        expect($route.current.controller).toBe('navBarController');
    });
    
    it('should redirect to the index path on non-existent route', function(){
        expect($location.path()).toBe('');

        $location.path('/a/non-existent/route');

        $rootScope.$digest();

        expect($location.path()).toBe( '/' );
        expect($route.current.controller).toBe('navbarController');
    });
    
    
});