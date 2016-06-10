/* global angular, $ */
/*global alert: false, console: false, jQuery: false */
/*jslint browser: true*/

var app = angular.module('biteplans', [
    'satellizer', 'ngRoute', 'bw.paging',
    'ngMaterial', 'materialCalendar',
    'angular-svg-round-progressbar',
    'ng.httpLoader', 'angular-img-cropper',
    'ui.materialize'
]);

var constantData = {
    'constants': {
        'API_SERVER': 'https://www.biteplans.com/',
        userOb : {}
    }
};

app.constant('constants', constantData.constants);