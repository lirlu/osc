mui.init();

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
	app.open('group.payment.html', view.extras);
});
