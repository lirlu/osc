(function (mui, $) {
var _Data = {'iOrderId':'', 'order_id':'', 'key':app.store('key')};

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	_Data.iOrderId = _Data.order_id = view.extras.iOrderId;
	// 从服务器请求订单详情
	var link = 'mobile/order/pay';
	if ('teambuy' == view.extras.paygroup) { link = 'mobile/GroupPurchase/order_detail'; };
	if ('order'   == view.extras.paygroup) { link = 'mobile/order/order_detail'; };
	console.log(app.url(link));
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url(link),
		'data'     : _Data
	})
	.fail(function (res) {
		console.log('读取订单数据失败：' + JSON.stringify(res));
		app.error('读取订单数据失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('订单数据：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		$('.order-total').text('￥' + (res.total_price || '0'));
	})
	;
});

function pay (channel) {
	var view = plus.webview.currentWebview();
	
	//console.log('参数：'+JSON.stringify(_Data));
	var link = 'mobile/order/pay';
	if ('teambuy' == view.extras.paygroup) { link = 'mobile/GroupPurchase/pay'; };
	if ('order'   == view.extras.paygroup) { link = 'mobile/order/pay'; };
	
	// 从服务器请求支付订单
	plus.nativeUI.showWaiting('正在提交订单...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url(link),
		'data'     : mui.extend({}, _Data, {'pay_type':channel.id})
	})
	.fail(function (res) {
		console.log('订单提交支付失败：' + JSON.stringify(res));
		app.error('订单提交支付失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('提交支付：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (!res || !res.url) { plus.nativeUI.toast('服务器返回数据出错'); return; }
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		if (!res.error) { plus.nativeUI.toast('提交失败...'); return; }
		//if ('cash' == data.payway) { success(_Data.iOrderId); return; }
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
}

// 提交订单
$('.btn-submit').on('tap', function () {
	var channel = null, payway = $('input[name=payway]:checked').val();
	//if (!channel) { plus.nativeUI.toast('你的手机没有此支付通道，请选择其他支付方式'); return; }    // 获取支付通道
    plus.payment.getChannels(function (channels) {
		for (var i in channels) {
			var channel = channels[i];
			if (payway == channel.id) { pay(channel); break; }
		}
    }, function (e) {
        alert("获取支付服务失败");
    });
});

// 支付成功，跳转到提示页面
function success (iOrderNo) {
	var view = plus.webview.currentWebview();
	
	var data = {'id':iOrderNo, 'payway':$('input[name=payway]:checked').val()}
	app.open('checkout.success.html', data);
	try {
		if (view.extras.callback) { plus.webview.getWebviewById(view.extras._FROM_).evalJS(view.extras.callback); }
	} catch (e) {}
	
	setTimeout(function () {
		plus.webview.currentWebview().close();
	}, 500);
	setTimeout(function () {
		plus.webview.getWebviewById('cart.html').evalJS('cart.refresh()');
	}, 800);
};

})(mui, $)
