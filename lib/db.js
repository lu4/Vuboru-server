var client = require('mongodb').MongoClient;

var q = require('q');
var settings = require('./settings');

var app = settings.app();

var connectionString = "mongodb://vuboru:123YYY321@ds029798.mongolab.com:29798/vuboru";

module.exports = q.nfcall(client.connect, connectionString).then(function (db) {
    return settings.set('db', db);
});