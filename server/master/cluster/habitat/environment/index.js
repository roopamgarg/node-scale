'use strict';

var os = require('os'),
    cluster = require('cluster'),

    actionEnum = require('../../../../../config/action'),

    util = require('./util'),
    message = require('./message'),

    monkeys = [],

    kCpuCount = os.cpus().length,

    wordCounter = 0;

exports.initialize = function() {
    var i, len, monkey;

    for(i = 0, len = kCpuCount; i < len; i++) {
        monkey = cluster.fork();

        monkeys.push(monkey);
    }
};

exports.registerAll = function() {
    monkeys.forEach(function(monkey) {
        exports.register(monkey);
    });

    console.log('Registered the entire habitat!');
};

exports.getAll = function() {
    return monkeys;
};

exports.register = function(monkey) {

    /**
     * Message from the current monkey to the master.
     */
    monkey.on('message', function(data) {
        var action = data.action,
            from = data.from;

        switch (action) {
            case actionEnum.GET_SERVER_META:
                console.log('Server meta came for monkey ' + monkey.id );

                message.sendInitialization(monkeys, from);

                break;
            case actionEnum.INCREMENT:
                wordCounter += data.payload;

                message.sendBroadcast(monkeys, actionEnum.UPDATE, wordCounter);

                break;
        }
    });
};
