(function (mui, $) {
var _Data = {'iOrderId':'', 'key':app.store('key')};

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	_Data.iOrderId = view.extras.iOrderId;
});

// 提交订单
$('.btn-submit').on('tap', function () {
	var view = plus.webview.currentWebview();
	var key  = app.store('key');
	
	var channel = payment.channels[$('input[name=payway]:checked').val()];
	//if (!channel) { plus.nativeUI.toast('你的手机没有此支付通道，请选择其他支付方式'); return; }
	
	console.log('参数：'+JSON.stringify(data));
	// 从服务器请求支付订单
	plus.nativeUI.showWaiting('正在提交订单...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/order/order_add'),
		'data'     : data
	})
	.fail(function (res) {
		console.log('订单提交支付失败：' + JSON.stringify(res));
		app.error('订单提交支付失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('提交支付：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		if (!res.error) { plus.nativeUI.toast('提交失败...'); return; }
		//if ('cash' == data.payway) { success(_Data.iOrderId); return; }
		if (!res.url) { plus.nativeUI.toast('服务器返回数据出错'); return; }
		//if (res.redirect_link) { pay_by_web(res.redirect_link); return; }
		
		plus.payment.request(channel, res.url, function (result) {
            plus.nativeUI.alert("支付成功！", function () { success(_Data.iOrderId); });
        }, function(error) {
        	console.log(JSON.stringify(error));
        	plus.nativeUI.alert("支付失败");
            //plus.nativeUI.alert("支付失败：" + error.message);
        });
	})
	;
});

// 支付成功，跳转到提示页面
function success (iOrderNo) {
	var data = {'id':iOrderNo, 'payway':$('input[name=payway]:checked').val()}
	app.open('checkout.success.html', data);
	setTimeout(function () {
		plus.webview.currentWebview().close();
	}, 500);
	setTimeout(function () {
		plus.webview.getWebviewById('cart.html').evalJS('cart.refresh()');
	}, 800);
};

})(mui, $)
