$('.btn-logout').on('tap', function () {
	localStorage.removeItem('key');
	localStorage.removeItem('user');
	
	plus.webview.getWebviewById('user.html').evalJS('refresh()');
	
	plus.webview.getWebviewById('cart.html').evalJS('cart.empty()');
	
	app.open('log.html');
	
	setTimeout(function () {
		plus.webview.currentWebview().close();
	}, 500);
});

// 普通页面跳转
$('body').delegate("[data-url]", 'tap', function() {
	app.open($(this).attr('data-url'));
});

$('.btn-clear-cache').on('tap', function () {
	plus.nativeUI.showWaiting();
	setTimeout(function () {
		plus.nativeUI.closeWaiting();
		plus.nativeUI.toast('缓存清除成功');
	}, 2000);
});
