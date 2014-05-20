'use strict';

// 192.168.56.104

var cluster = require('cluster'),
    swarm = require('./swarm'),

    wordCountServer = require('./server/http/wordCount');


function startForking() {
    if (cluster.isMaster) {
        swarm.initialize();
    } else {
        wordCountServer.create(client);
    }
}

startForking();
