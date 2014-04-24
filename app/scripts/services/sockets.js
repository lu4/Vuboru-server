'use strict';

angular.module('vuboruServerApp')
  .factory('sockets', ['io', function (io) {
        return io.connect();
    }]);
