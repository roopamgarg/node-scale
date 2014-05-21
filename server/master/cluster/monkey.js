'use strict';

var socket = require('../../client/websocket/wordCount'),

    actionEnum = require('../../config/action');

exports.initialize = function(callback) {
    process.send({action: actionEnum.GET_SERVER_META, from: cluster.worker.id});

    /**
     * This is a worker process; NOT the master.
     *
     * Handling messages to the current worker.
     */
    process.on('message', function(data) {
        var ip;

        switch (data.action) {
            case actionEnum.INITIALIZE:
                ip = data.payload;

                socket.initialize(ip);

                break;
            case actionEnum.UPDATE:
                callback({numWords: data.payload});

                break;
            case actionEnum.COMPUTE:
                var current = socket.getCurrent();

                if (current.connection) {
                    current.connection.sendUTF(JSON.stringify(data));
                }

                break;
        }
    });
};
