'use strict';

var settings = require('./lib/settings');
var express = require('express');
var http = require('http');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');

// Setup Express
var app = settings.initialise(express());

require('./lib/db').then(function (db) {
    console.log('Connection to MongoDB established!');

    require('./lib/config/express');
    require('./lib/routes');

    var server = settings.set('server', http.createServer(app));

    require('./lib/config/socketio');

    // Start server
    server.listen(config.port, config.ip, function () {
        console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
    });

    // Expose app
    exports = module.exports = app;
}).catch(function (error) {
    console.log(error.stack);
});