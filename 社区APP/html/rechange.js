// wxpay  微信
// alipay 支付宝
// cash   货到付款
var payment = {'channels':[]};

mui.init();

$(window).resize(function() {
	var winWidth = $(window).width();
	var lDiv = "";
	lDiv = $(".input-div").children(".block").width() + 15;
	$('.input-div').children("input").width(winWidth - lDiv);
}).resize();

mui.plusReady(function () {
	var user = app.store('user');

	$('.account').text(user.user_info.account);
	
    // 获取支付通道
    plus.payment.getChannels(function (channels) {
		payment.channels = channels;
    }, function (e) {
        alert("获取支付通道失败：" + e.message);
    });
});

// 提交充值
$('.btn-submit').on('tap', function () {
	var user = app.store('user');
	var data = {
		'key'     : app.store('key'),
		'account' : user.user_info.account,
		'money'   : $('#money').val(),
		'payway'  : $('[name="radio"]:checked').val(),
	}
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



