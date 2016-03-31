// wxpay  微信
// alipay 支付宝
// cash   货到付款
var payment = {'channels':{}};

mui.init();

$(window).resize(function() {
	var winWidth = $(window).width();
	var lDiv = "";
	lDiv = $(".input-div").children(".block").width() + 15;
	$('.input-div').children("input").width(winWidth - lDiv);
}).resize();

mui.plusReady(function () {
	var user = app.store('user');

	$('.account').text(user.account);
	
    // 获取支付通道
    plus.payment.getChannels(function (channels) {
		for (var i in channels) {
			var channel = channels[i];
			payment.channels[channel.id] = channel;
		}
    }, function (e) {
        alert("获取支付通道失败：" + e.message);
    });
});

// 提交充值
$('.btn-submit').on('tap', function () {
	var user = app.store('user');
	var data = {
		'key'     : app.store('key'),
		'account' : user.account,
		'money'   : $('#money').val(),
		'payway'  : $('[name="radio"]:checked').val(),
	}
	if (!data.money) { plus.nativeUI.toast('请输入充值金额'); return; }
	if (!/^\d+$/g.test(data.money)) { plus.nativeUI.toast('充值金额为数字'); return; }
	var channel = payment.channels[data.payway];
	if (!channel) { plus.nativeUI.toast('你的手机没有此支付通道，请选择其他支付方式'); return; }
	// 从服务器请求支付订单
	plus.nativeUI.showWaiting('正在提交充值订单...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/chongzhi'),
		'data'     : data
	})
	.fail(function (res) {
		console.log('提交充值订单失败：' + JSON.stringify(res));
		app.error('提交充值订单失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('提交充值订单结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		if (!res.error) { plus.nativeUI.toast('提交失败...'); return; }
		//if ('cash' == data.payway) { success(res.orderNo); return; }
		
		if (!res.url) { plus.nativeUI.toast('服务器返回数据出错'); return; }
		
		plus.payment.request(channel, res.url, function (result) {
            plus.nativeUI.alert("支付成功！", function () { success(res.orderNo); });
        }, function(error) {
        	console.log(JSON.stringify(error));
            plus.nativeUI.alert("支付失败：" + error.message);
        });
	})
	;
});

function success (iOrderNo) {
	plus.webview.getWebviewById('purse.html').evalJS('refresh()');
	plus.webview.currentWebview().close();
}



