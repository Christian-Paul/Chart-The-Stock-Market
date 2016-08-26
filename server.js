var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var https = require('https');
var config = require('./config.js');
var port = process.env.port || 3000


app.use('/public', express.static(path.join(__dirname, 'public')));

server.listen(port, function(req, res) {
	console.log('listening on ' + port);
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/api/:tagId', function(req, res) {
	var stockName = req.params.tagId;
	var dest = 'https://www.quandl.com/api/v3/datasets/WIKI/' + stockName + '.json?column_index=1&order=asc&start_date=2010-01-01&api_key=' + config.quandlKey;

	res.redirect(dest);
});


users = [];
connections = [];
io.sockets.on('connection', function(socket) {
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	// disconnect
	socket.on('disconnect', function(data) {
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected %s sockets connected', connections.length);
	});

});