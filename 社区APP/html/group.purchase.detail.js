mui.init();

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
		
		$('#pnl-product').append(template('tpl-product', res));
		
		// 未开始或已过期
		if (!res.tuan_view.expired) { $('.btn-submit').prop('disabled', false); }
	})
	;
});

$('.btn-submit').on('tap', function () {
	var dom  = this;
	var view = plus.webview.currentWebview();
	
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
		'data'     : {'key':app.store('key'), 'tuan_id':view.extras.id, 'payway':'online'}
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

