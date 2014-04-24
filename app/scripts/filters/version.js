'use strict';

angular.module('vuboruServerApp')
  .filter('version', function () {
    return function (item, version) {
      return item.$versions[version.name];
    };
  });
