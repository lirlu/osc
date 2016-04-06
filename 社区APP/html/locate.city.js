mui.plusReady(function () {
	$('.content').append(template('tpl-city', {'list':cityData3}));
	
	plus.geolocation.getCurrentPosition(
		function (res) {
			$('.located.city').data('locate', res).text(res.address.city);
		}, 
		function () {
			plus.nativeUI.toast('定位失败，请确认你已同意使用定位服务');
		}, 
		{ provider : 'baidu' }
	);
});

$('body').delegate('.second-city>li, .hot_city, .city.located', 'tap', function () {
	var auto = $(this).data('locate');
	var data = {'value':$(this).attr('data-id'), 'text':$(this).text(), 'auto':auto};
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
