mui.init();

template.helper('image', function (v) {
	return app.link.image + v;
});
template.helper('price', function (v) {
	return parseInt(v, 10) / 100;
});

mui.plusReady(refresh);
function refresh () {
	var view = plus.webview.currentWebview();
	var data = view.extras;
	if (!data.selected || 0 == data.selected.length) {
		alert('请至少选择一个商品再结算');
		plus.webview.currentWebview().close();
		return;
	}
	
	var key = localStorage.getItem('key');
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
	})
	;
}
