'use strict';

// TODO: use PM2 to replicate this.

var Q = require('q'),
    fs = require('fs'),
    http = require('http'),
    path = require('path');

function fetchData() {
    var deferred = Q.defer(),
        filePath = path.join( __dirname, "../../data/seed.txt" );

    fs.readFile(filePath, function (err, data) {
        if (err) {
            throw 'Error fetching seed data';
        }

        deferred.resolve(data);
    });

    return deferred.promise;
}

fetchData().then(function(buffer) {
    var chunks = [],
        data = buffer.toString(),
        i = 0,
        last = 0,
        len = data.length;

    while (i < len) {
        i += 100;

        chunks.push(data.substring(last, i));

        last = i;
    }

    var index = 0;

    function getNextChunk() {
        return chunks[(index++) % chunks.length]
    }

    /**
     * The whole purpose of this server is to create an infinite HTTP response.
     */
    http.createServer(function (request, response) {
        response.setHeader('Content-Type', 'text/html');
        response.setHeader('Transfer-Encoding', 'chunked');

        var id = setInterval(function() {
            response.write('<p>' + getNextChunk() + '</p>');
        }, 10);

        request.on('close', function() {
            clearInterval(id);
        });
    }).listen(8080);
});
