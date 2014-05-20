'use strict';

exports.initialize = function(client, callback) {
    process.send({action: 'get-server-meta', from: cluster.worker.id});

    process.on('message', function(data) {
        if (data.action) {
            if (data.action === 'initialize') {
                var ip = data.payload;

                wordCountClient.initialize(ip);

                return;
            }

            if (data.action === 'increment') {
                callback({numWords:data.payload});

                return;
            }

            if (data.action === 'dispatch') {
                if (client.connection) {
                    client.connection.sendUTF(JSON.stringify(data));
                }
            }
        }
    });
};
