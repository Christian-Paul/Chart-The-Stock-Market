var socket = io.connect();
var stockNames = ['GOOGL', 'AAPL'];
setupAndMakeChart(stockNames);

var userInput = $('.user-input');
var submitButton = $('.submit-button');

submitButton.click(function(e) {
	e.preventDefault();

	if(userInput.val()) {
		stockNames.push(userInput.val().toUpperCase());
		userInput.val('');
		setupAndMakeChart(stockNames);
	}
});