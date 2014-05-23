'use strict';

var http = require('http'),

    numWords = 0;

exports.update = function(data) {
    if (!data.numWords) {return;}

    numWords = data.numWords;
};

exports.listen = function() {
    http.createServer(function(request, response) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('<h1>' + numWords + '</h1>');
        response.end();
    }).listen(80);

    return exports.update;
};
