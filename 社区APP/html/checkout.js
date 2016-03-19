mui.init();

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
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/cart/add_num'),
		'data'     : {'key':key, 'cart':data.selected
		}
	})
	.fail(function (res) {
		console.log('结算初始化失败：' + JSON.stringify(res));
		app.error('结算初始化失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('结算数据：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
	})
	;
}
