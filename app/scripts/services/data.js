'use strict';

angular.module('vuboruServerApp')
  .factory('data', function ($rootScope, $timeout, $http, $q, _, sockets, nop, Entities) {
        var promise = $http.get('/api/db/0/' + moment().format("X")).then(function (request) {
            var data = request.data;
            var entities = new Entities(data.drafts, {
                $id: 'uuid' // our id is stored in 'uuid' property of each entity
            });

            entities.snapshot(data.tables);

            sockets.on('data', function (snapshot) {
                $rootScope.$apply(function () {
                    entities.snapshot(snapshot);
                });
            });

            return entities;
        });

        var result = {
            loadded: false,
            promise: promise,
            save: function (version) {
                var snapshot = version.snapshot();
                var sessionid = sockets.socket.sessionid;

                $http.post('/api/db', {
                    snapshot: snapshot,
                    sessionid: sessionid
                }).then(function (response) {
                    result.entities.snapshot(response.data.results);
                });
            }
        };

        promise.then(function (entities) {
            result.loadded = true;
            result.entities = entities;
        });

        $q.all($timeout(nop, 100), result.promise).then(function () {
            $rootScope.loadded = true;
        });

        return result
    });
