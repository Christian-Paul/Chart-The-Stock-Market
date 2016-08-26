var userInput = $('.user-input');
var submitButton = $('.submit-button');
var stocksContainer = $('.stocks-container');
var stock = $('.stock');
var socket = io.connect();
var stockNames = ['GOOGL', 'AAPL'];
setupAndMakeChart(stockNames);
buildStockBoard(stockNames);

submitButton.click(function(e) {

	e.preventDefault();

	if(userInput.val()) {
		stockNames.push(userInput.val().toUpperCase());
		userInput.val('');
		setupAndMakeChart(stockNames);
		buildStockBoard(stockNames);
	}

});

stocksContainer.on('click', stock, function(e) {
	var stockName = $(e.target).text();


	stockNames.splice(stockNames.indexOf(stockName), 1);
	setupAndMakeChart(stockNames);
	buildStockBoard(stockNames);
});

function buildStockBoard(names) {

	stocksContainer.empty();

	for(var i = 0; i < names.length; i++) {
		stocksContainer.append('<div class="stock">' + names[i] + '</div>');
	}

};