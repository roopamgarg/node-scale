'use strict';

var clusterConfig = require('../../config/cluster'),

    chunk = require('./chunk'),
    request = require('./request');



exports.consume = function(workers) {
    var options = {
            host: clusterConfig.ip.STREAM_LB,
            port: 80,
            path: '/',
            method: 'GET'
        },

        chunks = [];

    request.create(options, chunks);
    chunk.createPump(chunks, workers);
};
