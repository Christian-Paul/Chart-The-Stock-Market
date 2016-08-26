var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var https = require('https');
var port = process.env.port || 3000
var stockList = ['GOOG', 'AAPL'];

// get credentials from config file in dev, or from heroku env in deployment
if(port === 3000) {
	var config = require('./config.js');
} else {
	var config = {
		quandlKey: process.env.quandlKey
	};
}

app.use('/public', express.static(path.join(__dirname, 'public')));

server.listen(port, function(req, res) {
	console.log('listening on ' + port);
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});


// requests for stock data are handled through server so credentials remain hidden
app.get('/api/:tagId', function(req, res) {
	var stockName = req.params.tagId;
	var dest = 'https://www.quandl.com/api/v3/datasets/WIKI/' + stockName + '.json?column_index=1&order=asc&start_date=2010-01-01&api_key=' + config.quandlKey;

	res.redirect(dest);
});

connections = [];
io.sockets.on('connection', function(socket) {
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	// when a user connects, emit this event to only them
	// renders their chart and board for the first time
	io.to(socket.id).emit('update board', stockList);

	// when user disconnects, remove them from connections array
	socket.on('disconnect', function(data) {
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected %s sockets connected', connections.length);
	});

	// when a stock is added, push it to the stock list and update board
	socket.on('add stock', function(data) {
		stockList.push(data);
		updateBoard();
	});

	// when a stock is removed, remove it from the stock list and update board
	socket.on('remove stock', function(data) {
		stockList.splice(stockList.indexOf(data), 1);
		updateBoard();
	});

	// update board
	function updateBoard() {
		io.sockets.emit('update board', stockList);
	};
});