var cart = {};
cart.add = function (item) {
	var key = localStorage.getItem('key');
	plus.nativeUI.showWaiting();
	console.log('添加商品到购物车：' + app.url('mobile/cart/cartadd'));
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/cart/cartadd'),
		'data'     : {'key':key, 'shop_id':item.shop_id, 'id':item.goods_id, 'nums':item.quantity||1}
	})
	.fail(function (res) {
		console.log('添加商品到购物车失败：' + JSON.stringify(res));
		app.error('添加商品到购物车失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('添加商品到购物车结果：' + JSON.stringify(res));
		plus.nativeUI.toast(JSON.stringify(item) + '已成功加入购物车');
		plus.nativeUI.closeWaiting();
		
		cart.refresh();
	})
	;
}
cart.remove = function (item) {
	
}
cart.refresh = function () {
	var key = localStorage.getItem('key');
	console.log(key);
	console.log('加载购物车数据：' + app.url('mobile/cart/cart_list'));
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/cart/cart_list'),
		'data'     : {'key':key}
	})
	.fail(function (res) {
		console.log('加载购物车数据失败：' + JSON.stringify(res));
		app.error('加载购物车数据失败');
	})
	.done(function (res) {
		console.log('购物车数据：' + JSON.stringify(res));
		
		$('#pnl-cart').empty().append(template('tpl-cart', res));
	})
	;
}
mui.plusReady(function () {
	cart.refresh();
});
template.helper('image', function (v) {
	return app.link.image + v;
});
