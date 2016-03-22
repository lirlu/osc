mui.init();

$('button').on('tap', function () {
	plus.webview.getWebviewById('checkout.html').close();
	
	
	setTimeout(function () {
		plus.webview.getLaunchWebview().evalJS('trigger("user.html");');
		plus.webview.currentWebview().close();
	}, 500);
});
