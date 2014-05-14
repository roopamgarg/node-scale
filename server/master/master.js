'use strict';

var http = require('http'),

    kStreamUrl = 'http://192.168.56.101';

http.createServer(function (request, response) {
    response.setHeader('Content-Type', 'text/html');

    response.end('<p><b>' + 100 + '</b> total words processed so far.</p>');
}).listen(8080);


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
