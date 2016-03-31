// 普通页面跳转
$('body').delegate("[data-url]", 'tap', function() {
	app.open($(this).attr('data-url'));
});
// 跳转到需要登录才能操作的页面
$('body').delegate('[data-private]', 'tap', function () {
	if (!app.store('key')) {
		plus.nativeUI.toast('请先登录！');
		app.open('log.html');
		return;
	}
	app.open($(this).attr('data-private'));
});
// 跳转到外部页面
$('body').delegate('[data-outer]', 'tap', function () {
	app.open('outer.html', {'url':$(this).attr('data-outer')});
});

// 刷新城市
function init () {
	var city = app.store('city');
	console.log(localStorage.getItem('city'));
	if (city) {
		$('header .left span').text(city.text);
		return;
	}
	
	app.locate(function (res) {
		var addr = res.address;
		$('header .left span').text(addr.city || addr.province);
	});
}

mui.plusReady(init);

// 用户签到
$('.btn-sigin').on('tap', function () {
	var key = app.store('key');
	if (!key) { plus.nativeUI.toast('请先登录!'); return; }
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/qiandao'),
		'data'     : {'key':key }
	})
	.fail(function (res) {
		console.log('签到失败：' + JSON.stringify(res));
		app.error('签到失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('签到结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
	})
	;
});
