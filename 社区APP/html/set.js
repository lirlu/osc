$('.btn-logout').on('tap', function () {
	localStorage.removeItem('key');
	app.open('log.html');
	
	setTimeout(function () {
		plus.webview.currentWebview().close();
	}, 100);
});
