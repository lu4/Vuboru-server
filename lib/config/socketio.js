var Class = require('../Class');
var foreach = require('foreach-extended');

var $public = {
    ctor: function (io) {
        var sockets = this.sockets = { };

        io.on('connection', function (socket) {
            socket.on('disconnect', function () {
                delete sockets[socket.id];
            });

            sockets[socket.id] = socket;
        });
    },

    emit: function (name, data) {
        foreach(this.sockets, function (socket, id) {
            socket.emit(name, data);
        });
    },

    except: function (id, fn) {
        var sockets = this.sockets;
        var socket = sockets[id];

        if (socket) {
            try {
                delete sockets[id];

                fn.call(this);
            }
            finally {
                sockets[id] = socket;
            }
        } else {
            fn.call(this);
        }

        return socket;
    },

    exceptMany: function (socketIds, fn) {
        var sockets = this.sockets;
        var excludded = [ ];

        try {
            foreach(socketIds, function (id) {
                var socket = sockets[id];

                if (socket) {
                    delete sockets[id];

                    excludded.push(socket);
                }
            }, this);

            fn.call(this);
        }
        finally {
            foreach(excludded, function (socket) {
                sockets[socket.id] = socket;
            });
        }

        return excludded;
    }
};

var Sockets = Class.extend($public);

// -------------------------------------------------------------

var express = require('express');

var config = require('../settings');
var server = config.get('server');

var io = require('socket.io').listen(server, { log: false });

io.set('transports', ['websocket', 'flashsocket', 'htmlfile' , 'xhr-polling', 'jsonp-polling']);

config.set('sockets', new Sockets(io));

module.exports = config.set('io', io);