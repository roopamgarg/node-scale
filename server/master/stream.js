'use strict';

var clusterConfig = require('../../config/cluster'),

    pump = require('./pump'),
    request = require('./request'),

    options = {
        host: clusterConfig.ip.STREAM_LB,
        port: 80,
        path: '/',
        method: 'GET'
    },

    chunks = [];


function populateChunksAsync() {
    request.create(options, chunks);
}

function dispatchChunksAsync(monkeys) {
    pump.create(chunks, monkeys);
}

exports.consume = function(monkeys) {

    // Populates `chunks` collection at a constant speed.
    populateChunksAsync();

    // Consumes `chunks` collection by pumping them to monkeys.
    dispatchChunksAsync(monkeys);
};
