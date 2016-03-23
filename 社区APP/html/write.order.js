// 数量加减
$('#pnl-product').delegate('.float-r .add', 'tap', function(){
	var num = $(this).siblings('.number').text();
	if(num < 9){
		num++;
		num = $(this).siblings('.number').text(num);
	}
});
$('#pnl-product').delegate('.float-r .distance', 'tap', function(){
	var num = $(this).siblings('.number').text();
	if(num > 1){
		num--;
		num = $(this).siblings('.number').text(num);
	}
});

template.helper('image', function (v) {
	return app.link.image + v;
});

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	var data = view.extras, key = app.store('key');
	
	plus.nativeUI.showWaiting('请稍后...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/IntegralGoods/exchange_view'),
		'data'     : { 'key':key, 'shop_id':data.shop_id, 'goods_id':data.goods_id }
	})
	.fail(function (res) {
		console.log('取得商品详情失败：' + JSON.stringify(res));
		app.error('取得商品详情失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('取得商品详情：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('#pnl-product').append(template('tpl-product', {data:[res.info]}));
	})
	;
});