$('body').delegate("[address]", 'tap', function() {
	app.open($(this).attr('address'));
});
$('body').delegate('[data-outer]', 'tap', function () {
	app.open('outer.html', {'url':$(this).attr('data-outer')});
});

mui.plusReady(function () {
	app.locate(function (res) {
		var addr = res.address;
		$('header .left span').text(addr.street || addr.district || addr.city || addr.province);
	});
});
