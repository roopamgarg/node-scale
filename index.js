var http = require('http');

var counter = 0; 
http.createServer(function (request, response) {
    response.setHeader('Content-Type', 'text/plain');
    response.setHeader('Transfer-Encoding', 'chunked');



	request.on('close', function() {
		console.log('request closed');
	});


    setInterval(function() {
	response.write(' ' + (counter++));
    }, 1000);
}).listen(8080);
