'use strict';

angular.module('vuboruServerApp')
    .controller('VotesCtrl', function ($scope, $routeParams, $http, data) {
        data.promise.then(function (entities) {
            $scope.id = $routeParams.id;

            $scope.operation = $routeParams.operation;

            $scope.version = entities.version();

            if (!$scope.operation) {
                $scope.items = entities.tables['Vote'];
            } else if ($scope.operation == 'view') {
                $scope.item = entities.tables.Vote[$scope.id];
            } else if ($scope.operation === 'create') {
                $scope.item = $scope.version.track($scope.version.create('Vote'));
            } else if ($scope.operation === 'update') {
                $scope.item = $scope.version.track(entities.tables.Vote[$scope.id]);
            } else if ($scope.operation === 'delete') {
                $scope.item = $scope.version.track(entities.tables.Vote[$scope.id]);

                $scope.item.deleted = true;
            }

            $scope.store = function () {
                data.save($scope.version);
            };

            $scope.$on('$destroy', function () {
                $scope.version.dispose();
            });
        })
    });