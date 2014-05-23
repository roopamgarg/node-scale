'use strict';

var http = require('http'),

    data = require('./data'),
    util = require('./util');

data.fetch().then(function(buffer) {
    var chunks = [],
        text = buffer.toString();

    data.push(text, chunks);

    /**
     * The whole purpose of this server is to create an infinite HTTP response.
     */
    http.createServer(function (request, response) {
        response.setHeader('Content-Type', 'text/plain');
        response.setHeader('Transfer-Encoding', 'chunked');

        var id = setInterval(function() {
            response.write(util.getNextChunk(chunks));
        }, 10);

        request.on('close', function() {
            clearInterval(id);
        });
    }).listen(80);
});
