'use strict';

exports.run = function(workers, chunks) {
    var i, len;

    for (i = 0, len = workers.length; i < len; i++) {
        workers[i].send({action:'dispatch', current: chunks[i], next: chunks[i+1], from: null});
    }

    chunks.splice(0, workers.length);
};
