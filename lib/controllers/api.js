'use strict';

var q = require('q');
var moment = require('moment');
var foreach = require('foreach-extended');
var objectId = require('mongodb').ObjectID;

var UUID = require('../UUID');
var settings = require('../settings');
var validate = require('../validate');

var drafts = require('../metadata/drafts');
var mappings = require('../metadata/mappings');

var db = settings.get('db');

exports.getDb = function (req, res) {
    var tables = { };
    var errors = { };

    foreach(drafts, function (draft, draftName) {
        errors[draftName] = new Array();
        tables[draftName] = new Object();
    })

    var from = moment.unix(req.params.from);
    var till = moment.unix(req.params.till);

    till = till.isValid() ? till : moment();
    from = from.isValid() ? from : moment.unix(0);

    from = from.toJSON();
    till = till.toJSON();

    var query = {
        authoredOn: { $gte: from, $lte: till },
        $or: [{expired: { $exists: false }}, {expired: { $gt: till }}]
    };

    var tablesCount = 0;
    var tablesProcessed = 0;

    var iterationCompleted = function () {
        if (tablesCount <= ++tablesProcessed) {
            foreach(drafts, function (draft, draftName) {
                if (errors[draftName].length < 1) delete errors[draftName];
                if (!foreach(tables[draftName], function () { return true })) delete tables[draftName];
            })

            // Iterated over each collection
            res.send({
                tables: tables,
                drafts: drafts,
                errors: errors
            })
        }
    }

    foreach(drafts, function (schema, schemaName) {
        tablesCount++;
        var table = tables[schemaName];
        var error = errors[schemaName];
        var collection = db.collection(mappings[schemaName]);

        collection.find(query, function (err, cursor) {
            function processItem(err, item) {
                if (err) {
                    error.push(err);
                }

                if (item !== null) {
                    var uuid = item.uuid;

                    if (uuid in table) {
                        // We've got a collision, to prevent loading old data to the client
                        // we'll use a newer version until it is not marked as expired

                        var addedItem = table[uuid];

                        if (addedItem.authoredOn < item.authoredOn) {
                            table[uuid] = item;

                            collection.update({ _id: addedItem._id }, { $set: { expired: item.authoredOn } }, function (err, doc) {
                                if (err) {
                                    error.push(err);
                                }

                                cursor.nextObject(processItem);
                            });
                        } else {
                            collection.update({ _id: item._id }, { $set: { expired: addedItem.authoredOn } }, function (err, doc) {
                                if (err) {
                                    error.push(err);
                                }

                                cursor.nextObject(processItem);
                            });
                        }
                    } else {
                        table[uuid] = item;

                        delete item['expired']; // No need to expose info on when the object expired

                        cursor.nextObject(processItem);
                    }
                } else {
                    iterationCompleted();
                }
            };

            if (err) {
                error.push(err);
            } else {
                cursor.nextObject(processItem);
            }
        });
    });
};

exports.setDb = function (req, res) {
    var errors = new Object();
    var tables = new Object();

    var now = moment();
    var requestTime = now.toJSON();

    var tablesCount = 0;
    var documentsSaved = 0;

    var tableProcessed = function () {
        if (tablesCount <= ++documentsSaved) {
            // Iterated over each collection
            res.send({
                errors: errors,
                results: tables,
            });

            var sockets = settings.get('sockets');

            sockets.except(req.body.sessionid, function () {
                this.emit('data', tables); // Send only updates, no need to send errors
            });
        }
    }

    foreach(req.body.snapshot.creates, function (array, schemaName) {
        tablesCount++;

        var collection = db.collection(mappings[schemaName]);

        var length = array.length;

        for (var i = 0; i < length; i++) {
            var object = array[i];

            if (validate(requestTime, schemaName, object)) { // Ask permission whether this document is allowed to be stored, also update all autoproperties if needed
                object._id = objectId.createFromHexString(((Math.random().toString(16)+"000000000").substr(2,8) + (Math.random().toString(16)+"000000000").substr(2,8) + (Math.random().toString(16)+"000000000").substr(2,8)).substr(0, 24)); // A truly random ObjectId
                object.expired = "9999-12-31T23:59:59.999Z";
            } else {
                object = array.pop(); // take last object from array

                if (i < array.length) { // in case when `i === array.length` after we pop object if we set it back than no object will get removed
                    array[i] = object; length--;
                }
            }
        }

        collection.insert(array, { continueOnError: true }, function (err, inserted) { // The inserted documents will contain the ones that are not errored
            if (err) {
                errors[schemaName] = {
                    error: err,
                    object: object,
                    message: "Insert operation failed"
                };
            } else {
                tables[schemaName] = inserted;
            }

            tableProcessed();
        });
    });

    foreach(req.body.snapshot.updates, function (array, schemaName) {
        tablesCount++;

        var collection = db.collection(mappings[schemaName]);

        var length = array.length;

        for (var i = 0; i < length; i++) {
            var object = array[i];

            if (validate(requestTime, schemaName, object)) {
                object.__id = objectId.createFromHexString(object._id); // We are inserting new document, no need for an old id
                object._id = objectId.createFromHexString(((Math.random().toString(16)+"000000000").substr(2,8) + (Math.random().toString(16)+"000000000").substr(2,8) + (Math.random().toString(16)+"000000000").substr(2,8)).substr(0, 24)); // A truly random ObjectId
            } else {
                object = array.pop(); // take last object from array

                if (i < array.length) { // in case we haven't pop'ed the invalid object
                    array[i] = object; length--;
                }
            }
        }

        collection.insert(array, { continueOnError: true }, function (err, inserted) {
            if (err) {
                errors[schemaName] = {
                    error: err,
                    message: "Insert operation failed"
                };

                tableProcessed();
            } else {
                tables[schemaName] = inserted;

                var documentsUpdated = 0;

                foreach(inserted, function (inserted) {
                    // After new object is inserted set original object as expired
                    collection.update({ _id: inserted.__id }, { $set: { expired: requestTime } }, function (err, doc) { // Expire old objects
                        if (length <= ++documentsUpdated) {
                            tableProcessed();
                        }
                    });
                });
           }
        });
    });
}