'use strict';

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
        return chunks[(index++) % chunks.length];
    }

    /**
     * The whole purpose of this server is to create an infinite HTTP response.
     */
    http.createServer(function (request, response) {
        response.setHeader('Content-Type', 'text/plain');
        response.setHeader('Transfer-Encoding', 'chunked');

        var id = setInterval(function() {
            response.write(getNextChunk());
        }, 10);

        request.on('close', function() {
            clearInterval(id);
        });
    }).listen(80);
});

/*
1... wait
1,2 -> #1
1,2,3 -> #2
1,2,3,4 -> #3
1,2,3,4,5 -> #1


1: lorem ipsum dol   | send to process 1 --> wc - 1
2: or sit ame        |  | send to process 2 --> wc - 1
3: t velit verde ipsum  | | send to process 3 --> wc
4:  dolorem ame           |
5: t lorem
 */
