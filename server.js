var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.port || 3000
users = [];
connections = [];

server.listen(port, function(req, res) {
	console.log('listening on ' + port);
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});