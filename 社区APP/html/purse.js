mui.init();

mui.plusReady(function () {
	var key = localStorage.getItem('key');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/index'),
		'data'     : {'key':key}
	})
	.fail(function (res) {
		console.log('取得我的余额失败：' + JSON.stringify(res));
		app.error('取得我的余额失败');
		//plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('取得我的余额：' + JSON.stringify(res));
		//plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('.amount').val((res.money || '0') + '米币');
	})
	;
});

$('body').delegate('[data-url]', 'tap', function () {
	app.open($(this).attr('data-url'));
});




