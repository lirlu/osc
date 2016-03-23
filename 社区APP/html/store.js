
template.helper('image', function (v) {
	return app.link.image + v;
});
mui.plusReady(function () {
	plus.nativeUI.showWaiting('请稍后...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/chongzhi_log'),
		'data'     : { 'key':app.store('key') }
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
	
	app.open('write.order.html', {'id':$(this).closest('.product').attr('data-id')});
});


