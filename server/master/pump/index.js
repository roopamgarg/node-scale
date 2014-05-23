'use strict';

var dispatching = require('./dispatching');

exports.create = function(monkeys, chunks) {
    setInterval(function() {
        if (chunks.length <= monkeys.length + 1) {return;}

        dispatching.dispatch(monkeys, chunks);
    }, 100);
};
