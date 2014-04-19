'use strict';

angular.module('vuboruServerApp').controller('MainCtrl', function ($scope, $http) {
    $scope.sendSms = function () {
        $http.post('/api/sms', {
            content: "Some neat content"
        }).success(function (response) {
            console.log(response);
        });
    };
});
