// wxpay  微信
// alipay 支付宝
// cash   货到付款
var payment = {'channels':{}};

mui.init();

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	
    // 获取支付通道
    plus.payment.getChannels(function (channels) {
		for (var i in channels) {
			var channel = channels[i];
			payment.channels[channel.id] = channel;
			
			var html =  '<li><img src="../img/'+channel.id+'.png" />'+
						'<div class="mui-input-row mui-radio">'+
						'	<label>'+channel.description+'</label>'+
						'	<input name="channel" value="' + channel.id + '" type="radio">'+
						'</div>'
						'</li>'
						;
			$(html).appendTo($('.payway'));
		}
		$('.payway input[type=radio]:first').prop('checked', true);
    }, function (e) {
        alert("获取支付通道失败：" + e.message);
    });
	
	plus.nativeUI.showWaiting('加载中...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/GroupPurchase/order_checkout'),
		'data'     : {'key':app.store('key'), 'tuan_id':view.extras.id}
	})
	.fail(function (res) {
		console.log('加载商品信息失败：' + JSON.stringify(res));
		app.error('加载商品信息失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('商品信息：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) { app.error(res.msg); return; };
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('.title').text(res.tuan_view.title);
		$('.people').text(res.tuan_view.sold_num);
		$('.total').text('￥' + (res.tuan_view.tuan_price / 100));
		$('.btn-submit').prop('disabled', false);
	})
	;
});

$('.btn-submit').on('tap', function () {
	var dom  = this;
	var view = plus.webview.currentWebview();
	
	$(dom).prop('disabled', true);
	var pid = $('[name=channel]:checked').val(), channel = payment.channels[pid];;
	if (!channel) { plus.nativeUI.toast('你的手机支付宝支付和微信支付都不支持'); return; }
	
	console.log(JSON.stringify({'key':app.store('key'), 'id':view.extras.id, 'payway':pid}));
	// 从服务器请求支付订单
	plus.nativeUI.showWaiting('正在提交订单...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/GroupPurchase/pay'),
		'data'     : {'key':app.store('key'), 'id':view.extras.id, 'payway':pid}
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
		if (!res.error) { plus.nativeUI.toast('提交失败...'); return; }
		
		plus.payment.request(channel, res.url, function (result) {
            plus.nativeUI.alert("支付成功！", function () { success(res.orderNo); });
        }, function(error) {
        	console.log(JSON.stringify(error));
            plus.nativeUI.alert("支付失败：" + error.message);
        });
	})
	;
});

// 支付成功，跳转到提示页面
function success (iOrderNo) {
	plus.nativeUI.toast('支付成功，你已加入团购');
	plus.webview.currentWebview().close();
};
