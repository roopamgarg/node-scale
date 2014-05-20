'use strict';

var WebSocketServer = require('websocket').server,
    http = require('http'),

    server, wsServer;

function isOriginAllowed() {return true;}

server = http.createServer(function(request, response) {
    response.writeHead(404);
    response.end();
}).listen(80);

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
    if (!isOriginAllowed(request.origin)) {
        request.reject();

        return;
    }

    var connection = request.accept('word-count-protocol', request.origin);

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            var json = JSON.parse(message.utf8Data);

            connection.sendUTF('' + util.countWords(json.current, json.next));
        } else if (message.type === 'binary') {
            connection.sendBytes(message.binaryData);
        }
    });

    connection.on('close', function() {});
});
