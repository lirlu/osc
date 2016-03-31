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

$('body').delegate('.second-city>li, .hot_city', 'tap', function () {
	app.store('city', {'value':$(this).attr('data-id'), 'text':$(this).text()});
	
	plus.webview.getWebviewById('home.html').evalJS('init()');
	setTimeout(function () { plus.webview.currentWebview().close(); }, 100);
});
