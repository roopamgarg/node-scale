'use strict';

var os = require('os'),
    cluster = require('cluster'),

    clusterConfig = require('../../config/cluster'),

    kCpuCount = os.cpus().length,

    monkeys = [],

    wordCounter = 0,

    currentServerIndex = 0;


exports.dispatch = function() {
    monkeys.forEach(function(monkey) {
        monkey.send({action:'update', payload: wordCounter});
    });
};

exports.releaseTheMonkeys = function() {
    var i, len, monkey;

    for(i = 0, len = kCpuCount; i < len; i++) {
        monkey = cluster.fork();

        monkeys.push(monkey);
    }
};

exports.startListening = function() {
    monkeys.forEach(function(monkey) {
        monkey.on('message', function(data) {
            var action = data.action,
                from = data.from;

            if (action === 'get-server-meta') {
                monkeys.forEach(function(monkey) {
                    if ( monkey.id === from ) {
                        monkey.send({action:'initialize', payload: clusterConfig.workers[(currentServerIndex++) % clusterConfig.workers.length]});
                    }
                });

                return;
            }

            wordCounter += data.payload;

            exports.dispatch();
        });
    });
};

exports.initialize = function() {
    exports.releaseTheMonkeys();
    exports.startListening();

    stream.consume(monkeys);
};
