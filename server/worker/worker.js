'use strict';

var WebSocketServer = require('websocket').server,
    http = require('http'),

    protocol = require('../../config/protocol'),
    util = require('./util'),

    server, wsServer;

server = http.createServer(function(request, response) {
    response.writeHead(404);
    response.end();
}).listen(80);

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
    if (!util.isOriginAllowed(request.origin)) {
        request.reject();

        return;
    }

    var connection = request.accept(protocol.WORD_COUNT, request.origin);

    connection.on('message', function(message) {
        var json;

        switch (message.type) {
            case 'utf8':
                json = JSON.parse(message.utf8Data);

                connection.sendUTF('' + util.countWords(json.current, json.next));

                break;
            case 'binary':
                connection.sendBytes(message.binaryData);

                break;
        }
    });

    connection.on('close', function() {});
});
