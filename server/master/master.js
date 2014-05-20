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
        console.log('sending to slave');
        slaves[i].send({current: chunks[i], next: chunks[i+1]});
        console.log('sent to slave');
    }

    slaves.splice(0, kCpuCount);

    console.log('spliced slaves');
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
        consumeStream();

        for(i = 0, len = kCpuCount; i < len; i++) {
            slaves.push(cluster.fork());
        }
    } else {
        var WebSocket = require('ws'),
            ws = new WebSocket('ws://192.168.56.105');

        ws.on('open', function() {
            process.on('message', function(data) {
                console.log('got message');
                console.log(data);
                console.log(cluster.worker.id);

                ws.send(data);

                // TODO: do a remote calculation, and notify the master with the result when you're done.
            });
        });

        ws.on('message', function(data, flags) {
            console.log("message from web socket:" );
            console.log(data);
            // flags.binary will be set if a binary data is received
            // flags.masked will be set if the data was masked
        });
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
