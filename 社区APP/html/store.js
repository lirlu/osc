
template.helper('image', function (v) {
	return app.link.image + v;
});
mui.plusReady(function () {
	var key = app.store('key');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/index'),
		'data'     : {'key':key}
	})
	.fail(function (res) {
		console.log('取得我的余额失败：' + JSON.stringify(res));
		app.error('取得我的余额失败');
	})
	.done(function (res) {
		console.log('取得我的余额：' + JSON.stringify(res));
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('.integral .num').text(res.user_info.integral);
	})
	;
	
	plus.nativeUI.showWaiting('请稍后...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/IntegralGoods/goods_list'),
		'data'     : { 'key':key, 'page':1, 'limit':9999}
	})
	.fail(function (res) {
		console.log('查询米币商城商品失败：' + JSON.stringify(res));
		app.error('查询米币商城商品失败');
	})
	.done(function (res) {
		console.log('查询米币商城商品结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('#pnl-product').append(template('tpl-product', res));
	})
	;
});

// 查看商品详情：无
$('#pnl-product').delegate('.product', 'tap', function (e) {
	//app.open('')
});

// 米币兑换商品
$('#pnl-product').delegate('.btn-buy', 'tap', function (e) {
	e.stopPropagation();
	var data = {
		'goods_id' : $(this).closest('.product').attr('data-product'),
		'shop_id'  : $(this).closest('.product').attr('data-shop'),
	};
	
	app.open('write.order.html', data);
});


