'use strict';

var http = require('http'),
    os = require('os'),
    cluster = require('cluster'),

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
        host: 'localhost',
        port: 8080,
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
        process.on('message', function(data) {
            console.log('got message');
            console.log(data);
            console.log(cluster.worker.id);
        });
    }
}

startForking();
