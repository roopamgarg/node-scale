'use strict';

var dispatch = require('./dispatch');

exports.createPump = function(chunks, workers) {
    setInterval(function() {
        if ( chunks.length > workers.length + 1 ) {
            dispatch.run(workers, chunks);
        }
    }, 100);
};
