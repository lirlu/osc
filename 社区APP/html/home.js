$('body').delegate("[address]", 'tap', function() {
	app.open($(this).attr('address'));
});
$('body').delegate('[data-outer]', 'tap', function () {
	app.open('outer.html', {'url':$(this).attr('data-outer')});
});
