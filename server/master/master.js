'use strict';

// 192.168.56.104

var http = require('http'),
    os = require('os'),
    cluster = require('cluster'),
    websocket = require('websocket'),

    kCpuCount = os.cpus().length,

    chunks = [],

    slaves = [];

function dispatchChunksToSlaves() {
    var i, len;

    for (i = 0, len = kCpuCount; i < len; i++) {
        //console.log('sending to slave');
        slaves[i].send({current: chunks[i], next: chunks[i+1]});
        //console.log('sent to slave');
    }

    chunks.splice(0, kCpuCount);

    //console.log('spliced chunks');
}

function consumeStream() {
    var options = {
        host: '192.168.56.109',
        port: 80,
        path: '/',
        method: 'GET'
    },

    req = http.request(options, function(res) {
        res.setEncoding('utf8');

        res.on('data', function (chunk) {

            //console.log('data:' + chunk);
            chunks.push(chunk);
        });

        res.on('error', function(err) {
            console.log('Error...');
        });
    });

    req.write('');
    req.end();

    setInterval(function() {
        if ( chunks.length > kCpuCount + 1 ) {
            dispatchChunksToSlaves();
        }
    }, 100);
}

function startForking() {
    var i, len;

    if (cluster.isMaster) {
        var globalWordCounter = 0;

        for(i = 0, len = kCpuCount; i < len; i++) {
        //    console.log('pushing');
            slaves.push(cluster.fork());
        //    console.log(slaves.length);
        }

        // TODO: rename slave with worker
        slaves.forEach(function(slave) {
            slave.on('message', function(data) {
                console.log('got message');
                console.log(data);

                var action = data.action,
                    value = data.payload;

                globalWordCounter += value;

                slaves.forEach(function(slave) {
                    slave.send({action:'update', payload: globalWordCounter});
                });
            });
        });

        consumeStream();
    } else {

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

                client = new WebSocketClient();
            });

            connection.on('message', function(message) {
                var count = +message.utf8Data;

                process.send({action:"increment", payload: count});

                console.log('increment request sent');
            });
        });

        client.connect('ws://192.168.56.105/', 'word-count-protocol');

        var numWords = 0;

        process.on('message', function(data) {
            if (data.action) {
                numWords = data.payload;

                console.log(numWords);

                return;
            }

            if (client.connection) {
                client.connection.sendUTF(JSON.stringify(data));
            }
        });

        var server = http.createServer(function(request, response) {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('<h1>'+numWords+'</h1>');
            response.end();
        });

        server.listen(80);
    }
}

startForking();
