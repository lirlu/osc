$('body').delegate("[data-url]", 'tap', function() {
	app.open($(this).attr('data-url'));
});
$('body').delegate('#logoin button', 'tap', function() {
	var dom = this;
	var data = {
		'mobile'   : $('#tel').val(),
		'password' : $('#password').val(),
	};

	if ($(dom).hasClass('mui-disabled')) { return; }
	
	if (!data.mobile) {
		alert('手机号码输入不能为空');
		return false;
	} else if (!/^1[3,5,7,8,4]\d{9}$/.test(data.mobile)) {
		alert('手机号码输入有错');
		return false;
	} else if (!data.password) {
		alert('密码输入不能为空');
		return false;
	}
	
	console.log('请求登录：' + app.url('mobile/user/login'));
	$(dom).addClass('mui-disabled');
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/user/login'),
		'data'     : data
	})
	.fail(function (res) {
		console.log('请求登录失败：' + JSON.stringify(res));
		app.error('请求登录失败');
		plus.nativeUI.closeWaiting();
		$(dom).removeClass('mui-disabled');
	})
	.done(function (res) {
		console.log('请求登录结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		$(dom).removeClass('mui-disabled');
		
		if (200 != res.code) { app.error('请求登录失败'); return; }
		if (0 == res.status) { app.error(res.msg); return;}
		
		localStorage.setItem('key', res.key);
		//plus.webview.getWebviewById('user.html').evalJS('refresh()');
		plus.webview.show('user.html', 'pop-in', 200);
		plus.webview.currentWebview().close();
	})
	;
});