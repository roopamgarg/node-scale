'use strict';

var os = require('os'),
    cluster = require('cluster'),

    clusterConfig = require('../../../config/cluster'),
    actionEnum = require('../../../config/action'),

    stream = require('./../stream'),

    kCpuCount = os.cpus().length,

    monkeys = [],

    wordCounter = 0,

    currentServerIndex = 0;

function broadcast() {
    monkeys.forEach(function(monkey) {
        monkey.send({action: actionEnum.UPDATE, payload: wordCounter});
    });
}

function initializeMonkeys() {
    var i, len, monkey;

    for(i = 0, len = kCpuCount; i < len; i++) {
        monkey = cluster.fork();

        monkeys.push(monkey);
    }
}

function computeNewServerIndex() {
    currentServerIndex = ( currentServerIndex + 1 ) % clusterConfig.ip.workers.length;
}

function sendInitializationMessage(from) {
    monkeys.forEach(function(monkey) {
        if (monkey.id === from) {
            computeNewServerIndex();

            console.log('Monkey ' +
                monkey.id + ' will talk to ' +
                clusterConfig.ip.workers[currentServerIndex]
            );

            monkey.send({
                action: actionEnum.INITIALIZE,
                payload: clusterConfig.ip.workers[currentServerIndex]
            });
        }

    });

    console.log('Sent initialization messages to monkey ' + from);
}

function register(monkey) {

    /**
     * Message from the current monkey to the master.
     */
    monkey.on('message', function(data) {
        var action = data.action,
            from = data.from;

        switch (action) {
            case actionEnum.GET_SERVER_META:
                console.log('Server meta came for monkey ' + monkey.id );

                sendInitializationMessage(from);

                break;
            case actionEnum.INCREMENT:
                wordCounter += data.payload;

                broadcast();

                break;
        }
    });
}

function registerMonkeys() {
    monkeys.forEach(function(monkey) {
        register(monkey);
    });

    console.log('Registered the entire habitat!');
}

exports.initialize = function() {
    initializeMonkeys();
    registerMonkeys();

    stream.consume(monkeys);
};
