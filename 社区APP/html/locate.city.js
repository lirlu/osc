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

$('body').delegate('.second-city>li, .hot_city, .city.located', 'tap', function () {
	var data = {'value':$(this).attr('data-id'), 'text':$(this).text()};
	app.store('city', data);
	plus.webview.getWebviewById('home.html').evalJS('init()');
	
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/index/city'),
		'data'     : data
	})
	.fail(function (res) {
	})
	.done(function (res) {
	})
	;
	
	setTimeout(function () { plus.webview.currentWebview().close(); }, 100);
});
