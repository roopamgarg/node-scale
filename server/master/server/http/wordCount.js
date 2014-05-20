'use strict';

var http = require('http'),
    message = require('../message'),

    numWords = 0;

function update(data) {
    if (data.numWords) {
        numWords = data.numWords;
    }
}

function listen() {
    var server = http.createServer(function(request, response) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('<h1>'+numWords+'</h1>');
        response.end();
    });

    server.listen(80);
}

exports.create = function(client) {
    listen();

    message.initialize(client, update);
};
