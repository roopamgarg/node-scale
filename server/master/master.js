'use strict';

// 192.168.56.104

var http = require('http'),
    os = require('os'),
    cluster = require('cluster'),
    WebSocket = require('ws'),

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
        for(i = 0, len = kCpuCount; i < len; i++) {
        //    console.log('pushing');
            slaves.push(cluster.fork());
        //    console.log(slaves.length);
        }

        consumeStream();
    } else {
        console.log('creating new websocket');


        var WebSocketClient = require('websocket').client;

        var client = new WebSocketClient();

        client.on('connectFailed', function(error) {
            console.log('Connect Error: ' + error.toString());
        });

        client.on('connect', function(connection) {
            client.connection = connection;

            console.log('WebSocket client connected');
            connection.on('error', function(error) {
                console.log("Connection Error: " + error.toString());
            });
            connection.on('close', function() {
                console.log('echo-protocol Connection Closed');
            });
            connection.on('message', function(message) {
                if (message.type === 'utf8') {
                    console.log("Received: '" + message.utf8Data + "'");
                }
            });
//
//            function sendNumber() {
//                if (connection.connected) {
//                    var number = Math.round(Math.random() * 0xFFFFFF);
//                    connection.sendUTF(number.toString());
//                    setTimeout(sendNumber, 1000);
//                }
//            }
//            sendNumber();
        });

        client.connect('ws://192.168.56.104:8080/', 'echo-protocol');

        process.on('message', function(data) {
            client.connection && client.connection.sendUTF(JSON.stringify((data)));
        });



//
//        var ws = new WebSocket('ws://192.168.56.105');
//
//        var isOpened = false;
//
//        console.log('created new websocket');
//
//        process.on('message', function(data) {
//            //console.log('got message');
//            //console.log(data);
//            //console.log(cluster.worker.id);
//
//            try {
//                if ( isOpened ) {
//                    ws.send('a', {binary: false, mask: false}, function() {
//                        console.log('cb');
//                        console.log(arguments);
//                        console.log('----')
//                    });
//                    console.log('socket is opened');
//                    //isOpened = false;
//                }
//                //ws.send(data);
//            } catch (ignore) {
//
//            }
//
//            // TODO: do a remote calculation, and notify the master with the result when you're done.
//        });
//
//
//        ws.on('open', function() {
//            console.log('opened socket');
//
//            //ws.send('foo');
//
//            isOpened = true;
//        });
//
//        ws.on('message', function(message) {
//            console.log('received: %s', message);
//        });
//
//        ws.on('error', function(er) {
//            console.log('socket error!');
//        });
//
//        ws.on('close', function() {
//            console.log('socket being closed');
//        })

        setInterval(function() {

        }, 100);
    }
}

startForking();

/*
    if cluster is master
        connect to infinite stream
        spawn workers
        while new chunks arrive
            send chunks to workers in round-robin fashion

        when worker is done calculation
             process.send({action:'word-count', from: cluster.worker.id});
             where the master will listen to this message.

        when master gets a 'word-count' message, it updates its internal word count
        representation.

        word-count calculation is done on different servers where the process
        is forked with pm2
 */
