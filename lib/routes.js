'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    settings = require('./settings');

/**
 * Application routes
 */
var app = settings.app();

app.get('/api/db/:from/:till', api.getDb);
app.post('/api/db', api.setDb);

// All undefined api routes should return a 404
app.route('/api/*').get(function (req, res) { res.send(404); });

// All other routes to use Angular routing in app/scripts/app.js
app.route('/partials/*').get(index.partials);

app.route('/*').get(index.index);

module.exports = app;