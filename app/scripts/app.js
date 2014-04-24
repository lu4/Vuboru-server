'use strict';

angular.module('vuboruServerApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap'
])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/main',
                controller: 'MainCtrl'
            })
            .when('/votes', {
                templateUrl: 'partials/votes',
                controller: 'VotesCtrl',
            })
            .when('/votes/:operation', {
                templateUrl: 'partials/votes',
                controller: 'VotesCtrl',
            })
            .when('/votes/:operation/:id', {
                templateUrl: 'partials/votes',
                controller: 'VotesCtrl',
            })
            .when('/citizens', {
                templateUrl: 'partials/citizens',
                controller: 'CitizensCtrl',
            })
            .when('/citizens/:operation', {
                templateUrl: 'partials/citizens',
                controller: 'CitizensCtrl',
            })
            .when('/citizens/:operation/:id', {
                templateUrl: 'partials/citizens',
                controller: 'CitizensCtrl',
            })
            .when('/precincts', {
                templateUrl: 'partials/precincts',
                controller: 'PrecinctsCtrl',
            })
            .when('/precincts/:operation', {
                templateUrl: 'partials/precincts',
                controller: 'PrecinctsCtrl',
            })
            .when('/precincts/:operation/:id', {
                templateUrl: 'partials/precincts',
                controller: 'PrecinctsCtrl',
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
    });