$('body').delegate('[data-url]', 'tap', function () {
	app.open($(this).attr('data-url'));
});

mui.plusReady(refresh);

function refresh () {
	var key = app.store('key');
	
	if (!key) {
		$('.touxiang').empty().append('<a data-url="log.html"><img src="../img/touxiang.png" /></a>');
		$('.username').empty().append('<a data-url="log.html">未登录</a>');
		return;
	}
	
	//plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/index'),
		'data'     : {'key':key}
	})
	.fail(function (res) {
		console.log('取得用户信息失败：' + JSON.stringify(res));
		app.error('取得用户信息失败');
		//plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('取得用户信息：' + JSON.stringify(res));
		app.store('user', res);
		//plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		var src = res.user_info.img ? (app.link.image + res.user_info.img) : '../img/iconfont-morentouxiang.png';
		
		$('.touxiang').empty().append($('<img />').attr('src', src));
		$('.username').empty().append(res.user_info.nickname || res.user_info.account || '');
	})
	;
}
