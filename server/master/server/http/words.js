'use strict';

var http = require('http'),

    monkey = require('../../cluster/monkey'),

    connection = require('./connection');

exports.initialize = function() {
    monkey.initialize(connection.listen());
};
