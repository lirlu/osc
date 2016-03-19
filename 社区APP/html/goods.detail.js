mui.init();
mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	var data = view.extras;
	plus.nativeUI.showWaiting('请等待...');
	
	//设置title值
	$('#title').text(data.name);
	
	// 商品详情
	console.log('请求商品详情数据：' + app.url('mobile/goods/goods_view'));
	$.ajax({
		'dataType' : 'json',
		'type'     : 'get',
		'url'      : app.url('mobile/goods/goods_view'),
		'data'     : {
			'shop_id'  : data.shop_id,
			'goods_id' : data.goods_id,
		}
	})
	.fail(function (res) {
		console.log('请求商品详情数据失败：' + JSON.stringify(res));
		app.error('请求商品详情数据失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('商品详情数据：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		// 商品信息
		$('#pnl-product').empty().append(template('tpl-product', res));
		// 也许你还喜欢
		$('#pnl-related').empty().append(template('tpl-related', res));
	})
	;
});