'use strict';

var protocol = require('../../../../config/protocol'),
    actionEnum = require('../../../../config/action'),

    client = null;

exports.initialize = function(ip) {
    var WebSocketClient = websocket.client;

    client = new WebSocketClient();

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
            process.send({
                action: actionEnum.INCREMENT,
                payload: +message.utf8Data,
                from: cluster.worker.id
            });

            console.log('increment request sent');
        });
    });

    client.connect('ws://' + ip + '/', protocol.WORD_COUNT);

    return client;
};

exports.getCurrent = function() {return client;};