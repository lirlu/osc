mui.init();

// 向服务器上报支付的结果
function report (iOrderNo) {
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/order/order_checkout'),
		'data'     : data
	})
	.fail(function (res) {
		console.log('提交订单失败：' + JSON.stringify(res));
		app.error('提交订单失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('提交订单结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		success(iOrderNo);
	})
	;
};

$('button').on('tap', function () {
	plus.webview.getWebviewById('checkout.html').close();
	
	
	setTimeout(function () {
		plus.webview.getLaunchWebview().evalJS('trigger("user.html");');
		plus.webview.currentWebview().close();
	}, 500);
});
