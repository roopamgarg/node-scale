'use strict';

var http = require('http');

exports.create = function(options, chunks) {
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');

        var isLocked = false;

        res.on('data', function (chunk) {

            // Do not let the stream eat up all the memory if the rate things
            // are consumed are slower than they are produced.
            if (chunks.length > 1000) {
                isLocked = true;

                return;
            }

            if (chunks.length < 10) {
                isLocked = false;
            }

            if (isLocked) {
                return;
            }

            chunks.push(chunk);
        });

        res.on('error', function() {console.log('Error...');});
    });

    req.write('');
    req.end();
};
