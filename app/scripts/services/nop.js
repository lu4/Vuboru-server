'use strict';

angular.module('vuboruServerApp')
    .factory('nop', function () {
        return function () {
            // This is nop function, it does nothing...
        };
    });
