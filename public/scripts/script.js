var userInput = $('.user-input');
var submitButton = $('.submit-button');
var stocksContainer = $('.stocks-container');
var stock = $('.stock');
var socket = io.connect();

// emits an event and sends server the name of the stock to be added
submitButton.click(function(e) {
	e.preventDefault();

	// get user input
	var stockName = userInput.val().toUpperCase();


	// get all currently tracked stocks
	var stockHolder = document.querySelectorAll('.stocks-container .stock');

	var trackedStocks = [];
	stockHolder.forEach(function(stock) {
		trackedStocks.push(stock.firstChild.data);
	});

	// if user input is empty send error
	if(!stockName) {
		alert('Please enter a stock code');
	}
	else if (trackedStocks.indexOf(stockName) !== -1) {
		// if user submits a stock that's already tracked, send error
		alert('This stock is already being tracked')
	} else {

		// if the stock the user tried to add doesn't exist, send error
		$.getJSON('/api/' + stockName)
			.done(function(data) {
				userInput.val('');
				socket.emit('add stock', stockName);
			})
			.fail(function(data) {
				// notify user that the stock doesn't exist
				alert('Stock unavailable or doesn\'t exist');
			})
	}

});

// emits an event and sends server the name of the stock to be removed
stocksContainer.on('click', stock, function(e) {

	var stocksRemaining = document.querySelector('.stocks-container').children.length;

	// only remove stock if there's more than one stock left
	if(stocksRemaining > 1) {
		var stockName = $(e.target).text();
		socket.emit('remove stock', stockName);
	} else {
		alert('Cannot remove final stock');
	}

});

// server emits this event when it updates the list of tracked stocks
socket.on('update board', function(data) {
	setupAndMakeChart(data);
	buildStockBoard(data);
});

// clears and rebuilds the list of tracked stocks in the DOM
function buildStockBoard(names) {
	stocksContainer.empty();

	for(var i = 0; i < names.length; i++) {
		stocksContainer.append('<div class="stock">' + names[i] + '<span class="close-btn">&times;</span></div>');
	}
};