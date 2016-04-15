// 查看普通无需登录页面
$('body').delegate('[data-url]', 'tap', function () {
	app.open($(this).attr('data-url'));
});
// 要求登录后才能查看的页面
$('body').delegate('[data-private]', 'tap', function () {
	if (!app.store('key')) {
		app.open('log.html');
	} else {
		app.open($(this).attr('data-private'));
	}
});

mui.plusReady(autologin);

function autologin () {
	if (!app.store('key')) {
		$('.touxiang').empty().append('<a data-url="log.html"><img src="../img/iconfont-morentouxiang.png" /></a>');
		$('.username').empty().append('<a data-url="log.html">未登录</a>');
		return;
	}
	var user = app.store('user');

	//app.log('自动登录：' + app.url('mobile/user/user_login'));
	//plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/user/user_login'),
		'data'     : {'mobile':user.account, 'password':user.password}
	})
	.fail(function (res) {
		app.log('自动登录失败：' + JSON.stringify(res));
		app.error('自动登录失败');
		//plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('自动登录：' + JSON.stringify(res));
		//plus.nativeUI.closeWaiting();
		// 更新session的key值
		app.store('key', res.key);
		
		if (res.error && res.error.msg) { app.error(res.error.msg); localStorage.removeItem('key'); return; }
		if (false == res.status) {app.error(res.msg); localStorage.removeItem('key'); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		var src = res.user_info.img ? (app.link.image + res.user_info.img) : '../img/iconfont-morentouxiang.png';
		
		$('.touxiang').empty().append($('<img data-url="user.profile.html"/>').attr('src', src));
		$('.username').empty().append(res.user_info.nickname || res.user_info.account || '');
		
		plus.webview.getWebviewById('cart.html').evalJS('cart.refresh()');
	})
	;
}

setInterval(autologin, 20000);

function refresh () {
	var key = app.store('key');
	
	if (!key) {
		$('.touxiang').empty().append('<a data-url="log.html"><img src="../img/iconfont-morentouxiang.png" /></a>');
		$('.username').empty().append('<a data-url="log.html">未登录</a>');
		return;
	}
	app.log('自动登录：' + key);
	//plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/index'),
		'data'     : {'key':key}
	})
	.fail(function (res) {
		app.log('取得用户信息失败：' + JSON.stringify(res));
		app.error('取得用户信息失败');
		//plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('取得用户信息：' + JSON.stringify(res));
		app.store('user', res.user_info);
		//plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); localStorage.removeItem('key'); return; }
		if (false == res.status) {app.error(res.msg); localStorage.removeItem('key'); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		var src = res.user_info.img ? (app.link.image + res.user_info.img) : '../img/iconfont-morentouxiang.png';
		
		$('.touxiang').empty().append($('<img data-url="user.profile.html"/>').attr('src', src));
		$('.username').empty().append(res.user_info.nickname || res.user_info.account || '');
	})
	;
}
