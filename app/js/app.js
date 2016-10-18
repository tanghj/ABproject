'use strict';

angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/view1', {
        templateUrl: 'partials/partial1.html',
        controller: 'MyCtrl1'
    })
    .when('/view2', {
        templateUrl: 'partials/partial2.html',
        controller: 'MyCtrl2'
    })
    .when('/view3', {
        templateUrl: 'partials/partial3.html',
        controller: 'MyCtrl3'
    })
    .otherwise({
        redirectTo: '/view1'
    });
}]);

