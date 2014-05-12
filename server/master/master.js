'use strict';

var http = require('http'),
    os = require('os'),
    cluster = require('cluster'),

    kCpuCount = os.cpus().length,

    chunks = [],

    slaves = [];

function dispatchChunksToSlaves() {
    // TODO: implement me.
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
            chunks.push(data);
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
    var i, len, worker;

    if (cluster.isMaster) {
        consumeStream();

        for(i = 0, len = kCpuCount; i < len; i++) {
            worker = cluster.fork();
            slaves.push(worker);

            // TODO: what if a slave dies?
        }
    } else {

    }
}

startForking();
