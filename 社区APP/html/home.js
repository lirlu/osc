$('body').delegate("[address]", 'tap', function() {
	var url = $(this).attr('address');
	
	app.open(url);
});