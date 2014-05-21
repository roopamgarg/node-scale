'use strict';

var http = require('http');

exports.create = function(options, chunks) {
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');

        res.on('data', function (chunk) {chunks.push(chunk);});

        res.on('error', function() {console.log('Error...');});
    });

    req.write('');
    req.end();
};
