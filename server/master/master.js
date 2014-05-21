'use strict';

var cluster = require('cluster'),

    habitat = require('./cluster/habitat'),
    server = require('./server/http/words');

if (cluster.isMaster) {
    habitat.initialize();
} else {
    server.initialize();
}

