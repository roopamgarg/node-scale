'use strict';

var clusterConfig = require('../../../../../config/cluster'),

    currentServerIndex = 0;

exports.computeNewServerIndex = function() {
    currentServerIndex = ( currentServerIndex + 1 ) % clusterConfig.ip.workers.length;

    return currentServerIndex;
};
