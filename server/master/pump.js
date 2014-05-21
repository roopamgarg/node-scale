'use strict';

var actionEnum = require('../../config/action');

function dispatch(workers, chunks) {
    var i, len;

    for (i = 0, len = workers.length; i < len; i++) {
        workers[i].send({
            action: actionEnum.COMPUTE,
            current: chunks[i],
            next: chunks[i+1],

            // From: "the alpha, and the omega". (i.e., master process).
            from: null
        });
    }

    // remove the processed ones.
    chunks.splice(0, workers.length);
}

exports.create = function(chunks, workers) {
    setInterval(function() {
        if ( chunks.length > workers.length + 1 ) {
            dispatch(workers, chunks);
        }
    }, 100);
};
