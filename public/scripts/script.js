var userInput = $('.user-input');
var submitButton = $('.submit-button');
var stocksContainer = $('.stocks-container');
var stock = $('.stock');
var socket = io.connect();

// emits an event and sends server the name of the stock to be added
submitButton.click(function(e) {
	e.preventDefault();

	if(userInput.val()) {
		var stockName = userInput.val().toUpperCase();
		userInput.val('');
		socket.emit('add stock', stockName);
	};

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