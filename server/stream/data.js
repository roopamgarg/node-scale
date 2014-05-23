'use strict';

var Q = require('q'),
    fs = require('fs'),
    http = require('http'),
    path = require('path');

exports.fetch = function() {
    var deferred = Q.defer(),
        filePath = path.join( __dirname, "../../data/seed.txt" );

    fs.readFile(filePath, function(err, data) {
        if (err) {
            throw 'Error fetching seed data';
        }

        deferred.resolve(data);
    });

    return deferred.promise;
};

exports.push = function(data, chunks) {
    var i = 0,
        last = 0,
        len = data.length;

    while (i < len) {
        i += 100;

        chunks.push(data.substring(last, i));

        last = i;
    }
};
