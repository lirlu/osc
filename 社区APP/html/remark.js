mui.init();

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	var data = view.extras;
});

$('.btn-submit').on('tap', function () {
	plus.webview.currentWebview().close();
	var text = '我不吃辣';
	plus.webview.getWebviewById('checkout.html').evalJS('doLeaveNote("'+text+'")');
});
