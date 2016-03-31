mui.plusReady(function () {
	$('.content').append(template('tpl-city', {'list':cityData3}));
	
	plus.geolocation.getCurrentPosition(
		function (res) {
			$('.located.city').text(res.address.city);
		}, 
		function () {
		}, 
		{ provider : 'baidu' }
	);
});
