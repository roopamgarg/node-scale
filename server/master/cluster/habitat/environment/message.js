'use strict';

var util = require('./util'),

    clusterConfig = require('../../../../../config/cluster'),
    actionEnum = require('../../../../../config/action');


exports.sendBroadcast = function(monkeys, action, payload) {
    monkeys.forEach(function(monkey) {
        monkey.send({action: action, payload: payload});
    });
};

exports.sendInitialization = function(monkeys, from) {
    monkeys.forEach(function(monkey) {
        if (monkey.id === from) {
            var index = util.computeNewServerIndex();

            console.log('Monkey ' +
                    monkey.id + ' will talk to ' +
                    clusterConfig.ip.workers[index]
            );

            monkey.send({
                action: actionEnum.INITIALIZE,
                payload: clusterConfig.ip.workers[index]
            });
        }
    });

    console.log('Sent initialization messages to monkey ' + from);
};
