'use strict';

function countWords(previous, next) {
    var kWhitespaceRegExp = /\S/,
        isPreviousEndsWithWhiteSpace = kWhitespaceRegExp.test(
            previous.substring(previous.length - 1)),
        isNextBeginsWithWhiteSpace = kWhitespaceRegExp.test(next[0]);

    if (!isNextBeginsWithWhiteSpace && !isPreviousEndsWithWhiteSpace) {
        return previous.split(/\s+/) - 1;
    }

    return previous.split(/\s+/);
}

//var WebSocketServer = WebSocket.Server,
//    wss = new WebSocketServer({port: 80});
//
//// This could have been an HTTP server, UDP server etc.
//wss.on('connection', function(ws) {
//    console.log('Connection event...');
//
//    ws.on('message', function(message) {
//        console.log('received: %s', message);
//
//        ws.send(42);
//    });
//
//    ws.on('error', function() {
//        console.log('real error');
//    });
//});


var WebSocketServer = require('websocket').server,
    http = require('http'),

    server, wsServer;


server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(80, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        request.reject();

        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');

        return;
    }

    var connection = request.accept('word-count-protocol', request.origin);

    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);

            connection.sendUTF("42");
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
