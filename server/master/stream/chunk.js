'use strict';

var clusterConfig = require('../../../config/cluster'),

    pump = require('./../pump/index'),
    request = require('./../request/index'),

    options = {
        host: clusterConfig.ip.STREAM_LB,
        port: 80,
        path: '/',
        method: 'GET'
    },

    chunks = [];

exports.populateAsync = function() {
    request.create(options, chunks);
};


exports.dispatchAsync = function(monkeys) {
    pump.create(monkeys, chunks);
};
