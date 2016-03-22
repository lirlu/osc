$('.btn-logout').on('tap', function () {
	localStorage.removeItem('key');
	localStorage.removeItem('user');
	app.open('log.html');
	
	setTimeout(function () {
		plus.webview.currentWebview().close();
	}, 500);
});
