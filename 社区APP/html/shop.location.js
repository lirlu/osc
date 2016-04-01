mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	
	$('#shop-name').text(view.extras.name);
});