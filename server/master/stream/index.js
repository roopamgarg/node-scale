'use strict';

var chunk = require('./chunk');

exports.consume = function(monkeys) {
    console.log('Initializing stream consumer...');

    // Populates `chunks` collection at a constant speed.
    chunk.populateAsync();

    console.log('Initialized chunk generation request');

    // Consumes `chunks` collection by pumping them to monkeys.
    chunk.dispatchAsync(monkeys);

    console.log('Initialized stream consumer.');
};
