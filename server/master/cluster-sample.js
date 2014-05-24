'use strict';

var cluster = require('cluster'),
    os = require('os'),
    http = require('http'),
    i, len, worker;

if (cluster.isMaster) {
    for (i = 0, len = os.cpus().length; i < len; i++) {
        worker = cluster.fork();
        worker.send('Hi there!');
    }
} else {
    http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<p>Hello World.</p>');

        process.send('Hi from #' + cluster.worker.id);
    }).listen(80);
}
