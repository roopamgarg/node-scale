'use strict';

var WebSocket = require('ws');

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

var WebSocketServer = WebSocket.Server,
    wss = new WebSocketServer({port: 80});

// This could have been an HTTP server, UDP server etc.
wss.on('connection', function(ws) {
    console.log('Connection event...');

    ws.on('message', function(message) {
        console.log('received: %s', message);

        ws.send(42);
    });

    ws.on('error', function() {
        console.log('real error');
    });
});
