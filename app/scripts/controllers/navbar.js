'use strict';

angular.module('vuboruServerApp')
    .controller('NavbarCtrl', function ($scope, $location) {
        var menu = $scope.menu = [
            {
                'title': 'Головна',
                'link': '/'
            },
            {
                'title': 'Дільниці',
                'link': '/precincts'
            },
            {
                'title': 'Громадяни',
                'link': '/citizens'
            },
            {
                'title': 'Голоси',
                'link': '/votes'
            }
        ];

        var isActive = $scope.isActive = function (route) {
            var pathSegments = $location.path().split('/');
            var routeSegments = route.split('/');

            return pathSegments[1] === routeSegments[1];
        };

        $scope.active = function() {
            for (var i = 0; i < menu.length; i++){
                if (isActive(menu[i].link)) return menu[i]
            }
        };

    });
