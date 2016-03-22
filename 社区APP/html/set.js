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
