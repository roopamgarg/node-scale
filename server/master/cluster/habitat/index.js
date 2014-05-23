'use strict';

var stream = require('../../stream'),
    env = require('./environment');

exports.initialize = function() {
    env.initialize();
    env.registerAll();
    stream.consume(env.getAll());
};
