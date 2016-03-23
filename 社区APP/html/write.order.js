// 数量加减
$('.float-r .add').click(function(){
	var num = $(this).siblings('.number').text();
	if(num < 9){
		num++;
		num = $(this).siblings('.number').text(num);
	}
});
$('.float-r .distance').click(function(){
	var num = $(this).siblings('.number').text();
	if(num > 1){
		num--;
		num = $(this).siblings('.number').text(num);
	}
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
	})
	.done(function (res) {
		console.log('取得商品详情：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		//$('#pnl-product').append(template('tpl-product', res));
	})
	;
});