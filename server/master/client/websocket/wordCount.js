'use strict';

exports.initialize = function(ip) {
    var WebSocketClient = websocket.client;

    var client = new WebSocketClient();

    client.on('connectFailed', function(error) {
        console.log('Connect Error: ' + error.toString());
    });

    client.on('connect', function(connection) {
        client.connection = connection;

        connection.on('error', function(error) {
            console.log('Connection Error: ' + error.toString());
        });

        connection.on('close', function() {
            console.log('word-count-protocol: Connection Closed.');
        });

        connection.on('message', function(message) {
            var count = +message.utf8Data;

            process.send({action:"increment", payload: count, from: cluster.worker.id});

            console.log('increment request sent');
        });
    });

    client.connect('ws://' + ip + '/', 'word-count-protocol');
};
