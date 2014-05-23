'use strict';

var actionEnum = require('../../../config/action');

exports.dispatch = function(monkeys, chunks) {
    var i, len;

    for (i = 0, len = monkeys.length; i < len; i++) {
        monkeys[i].send({
            action: actionEnum.COMPUTE,
            current: chunks[i],
            next: chunks[i+1],

            // From: "the alpha, and the omega". (i.e., master process).
            from: null
        });
    }

    // remove the processed ones.
    chunks.splice(0, monkeys.length);
};
