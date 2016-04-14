// wxpay  微信
// alipay 支付宝
// cash   货到付款
var payment = {'channels':{}};

mui.init();

var mask = mui.createMask();
$('.mui-icon-closeempty').on('tap', function () {
	$('#after-pay').removeClass('active');
	mask.close();
});
$('#after-pay .btn-finish').on('tap', function () {
	plus.webview.currentWebview().close();
});
$('#after-pay .btn-repay').on('tap', function () {
	$('#after-pay').removeClass('active');
	mask.close();
});
function pay_by_web (url) {
	mask.show();
	$('#after-pay').addClass('active');
	app.open('outer.html', {'url':url});
}

template.helper('image', function (v) {
	return app.link.image + v;
});
template.helper('price', function (v) {
	return parseInt(v, 10) / 100;
});

mui.plusReady(function () {
    // 获取支付通道
    plus.payment.getChannels(function (channels) {
		for (var i in channels) {
			var channel = channels[i];
			payment.channels[channel.id] = channel;
		}
		
		//$('#pnl-payway').prepend(template('tpl-payway', {data:channels}));
    }, function (e) {
        alert("获取支付通道失败：" + e.message);
    });
    
    refresh();
});
function refresh () {
	var view = plus.webview.currentWebview();
	var data = view.extras;
	if (!data.selected || 0 == data.selected.length) {
		alert('请至少选择一个商品再结算');
		plus.webview.currentWebview().close();
		return;
	}
	
	var key = app.store('key');
	//console.log('结算请求：' + JSON.stringify({'key':key, 'cart':data.selected}));
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/order/order_checkout'),
		'data'     : {'key':key, 'cart':data.selected}
	})
	.fail(function (res) {
		console.log('结算初始化失败：' + JSON.stringify(res));
		app.error('结算初始化失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('结算数据：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		$('#pnl-product').append(template('tpl-product', res));
		
		doSetAddress(res.addr_info);
	})
	;
}
// 选择收货地址
$('section.address li').on('tap', function () {
	app.open('select.address.html', {'select':$('[name=delivery-addr]').val()});
});
function doSetAddress (item) {
	console.log('选择收货地址：' + JSON.stringify(item));
	
	if (!item) { return; }
	$('section.address li input').val(item.id);
	$('section.address li span.human').text(item.name + ' ' + item.tel);
	$('section.address li span.addr').text(area(item.provice, item.city, item.state) +' '+ item.addr);
}
function area (pro, city, ctr) {
	var a, b, c;
	
	for (var i in cityData3) {
		var item = cityData3[i];
		if (item.value == pro) {
			a = item;
			break;
		}
	}
	a = a ? a : {'text':'', 'children':[]};
	
	for (var i in a.children) {
		var item = a.children[i];
		if (item.value == city) {
			b = item;
			break;
		}
	}
	b = b ? b : {'text':'', 'children':[]};
	
	for (var i in b.children) {
		var item = b.children[i];
		if (item.value == ctr) {
			c = item;
			break;
		}
	}
	c = c ? c : {'text':'', 'children':[]};
	
	return (a.text +' '+ b.text +' '+ c.text);
};
// 选择送货时间
$('.btn-choose-time').on('tap', function () {
	var options = {
		"type"       : "hour",
		"customData" : {
			"h":[
				{"text":"上午","value":"上午"},
				{"text":"下午","value":"下午"},
				{"text":"晚上","value":"晚上"}
			]
		},
		"labels"     :["年", "月", "日", "时段", "分"]
	};

	var picker = new mui.DtPicker(options);
	picker.show(function(res) {
		$('[name=delivery-time]').val(res.text);
		$('.time-hint').text(res.text);
		if (1 == 1) {
			//plus.nativeUI.toast('不能选择今天以前的时间');
			//return false;
		}
		picker.dispose();
	});
});
$('[name=invoice]').on('change', function () {
	$('.invoice-input-row').toggleClass('mui-hidden');
});
// 点击留言
$('.btn-leave-note').on('tap', function () {
	app.open('remark.html', {'note':$('[name=note-text]').val()});
});
function doLeaveNote (text) {
	//console.log('留言信息：' + text);
	$('.note-hint').text(text);
}
// 提交订单
$('.btn-submit').on('tap', function () {
	var view = plus.webview.currentWebview();
	var key  = app.store('key');

	var data = {
		'key'    : key,
		'payway' : $('[name=payway]:checked').val(),// 支付方式
		'cart'   : view.extras.selected,// 选中结算的商品
		'address': $('[name=delivery-addr]').val(),//收货地址ID
		'time'   : $('[name=delivery-time]').val(),//送货时间
		'note'   : $('[name=note-text]').val(),//买家留言
		'invoice': $('[name=invoice]').is(':checked') ? 1 : 0,//是否需要发票
		'title'  : $('[name=invoice-name]').val(),//发票抬头
	};
	if (!data.address) { alert('请选择收货地址'); return; }
	if (data.invoice && !data.title) { alert('请填写发票抬头'); return; }
	
	var channel = payment.channels[data.payway];
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
		
		
		setTimeout(function () {
			try {
				plus.webview.getWebviewById('cart.html').evalJS('cart.refresh()');
			} catch (e) {}
		}, 500);
		
		// 订单创建成功，去支付页面
		if ('cash' == data.payway) { success(res.order_id); return; }
		var extras = {
			'iOrderId' : res.order_id,
			'iOrderNo' : res.order_no,
			'payway'   : $('[name=payway]:checked').val(),
			'paygroup' : 'order',
		};
		app.open('checkout.payway.html', extras);
		setTimeout(function () { plus.webview.currentWebview().close(); }, 500);
		
		/*
		if (!res.error) { plus.nativeUI.toast('提交失败...'); return; }
		if ('cash' == data.payway) { success(res.orderNo); return; }
		if (!res.url) { plus.nativeUI.toast('服务器返回数据出错'); return; }
		if (res.redirect_link) { pay_by_web(res.redirect_link); return; }
		
		plus.payment.request(channel, res.url, function (result) {
            plus.nativeUI.alert("支付成功！", function () { success(res.orderNo); });
        }, function(error) {
        	console.log(JSON.stringify(error));
        	plus.nativeUI.alert("支付失败");
            //plus.nativeUI.alert("支付失败：" + error.message);
        });
        */
	})
	;
});

// 支付成功，跳转到提示页面
function success (iOrderNo) {
	app.open('checkout.success.html', {'id':iOrderNo, 'way':$('[name=payway]:checked').val()});
	setTimeout(function () {
		plus.webview.currentWebview().close();
	}, 500);
};
