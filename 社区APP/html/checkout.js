mui.init();

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	var data = view.extras;
	console.log('订单数据：' + JSON.stringify(data));
});