mui.init();

// 查看普通无需登录页面
$('body').delegate('[data-url]', 'tap', function () {
	app.open($(this).attr('data-url'));
});

template.helper('image', function (v) {
	return app.link.image + v;
});
template.helper('price', function (v) {
	return v / 100;
});

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	
	plus.nativeUI.showWaiting('加载中...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/GroupPurchase/goods_view'),
		'data'     : {'key':app.store('key'), 'tuan_id':view.extras.id}
	})
	.fail(function (res) {
		app.log('加载商品信息失败：' + JSON.stringify(res));
		app.error('加载商品信息失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('商品信息：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) { app.error(res.msg); return; };
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('#pnl-product').append(template('tpl-product', res));
		
		// 未开始或已过期
		if (!res.tuan_view.expired) { $('.btn-submit').prop('disabled', false); }
	})
	;
});

$('.btn-submit').on('tap', function () {
	var dom  = this;
	var view = plus.webview.currentWebview();
	
	if (!$('.addr-row').is(':visible')) {
		$('.addr-row').show();
		return;
	} else if (!$('.address input').val()) {
		plus.nativeUI.toast('请选择收货地址');
		return;
	}
	
	if (!app.store('key')) {
		plus.nativeUI.toast('请先登录！');
		app.open('log.html');
		return;
	}
	
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/GroupPurchase/add_order'),
		'data'     : {
			'key'       : app.store('key'),
			'tuan_id'   : view.extras.id,
			'payway'    : 'online',
			'addr_id'   : $('.address input').val(),
			'addr_text' : $('.address addr').text(),
		}
	})
	.fail(function (res) {
		app.log('加载商品信息失败：' + JSON.stringify(res));
		app.error('加载商品信息失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('商品信息：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) { app.error(res.msg); return; };
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		var data = {
			'iOrderId' : res.order_id,
			'iOrderNo' : res.order_no,
			'payway'   : 'online',
			'paygroup' : 'teambuy',
		};
		app.open('checkout.payway.html', data)
	})
	;
});

function doSetAddress (item) {
	app.log('选择收货地址：' + JSON.stringify(item));
	
	if (!item) { return; }
	$('.address input').val(item.id);
	$('.address .name').text(item.name + '  ' + item.tel);
	$('.address .addr').text(area(item.provice, item.city, item.state) +' '+ item.addr);
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
