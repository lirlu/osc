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
		//console.log('添加商品到购物车结果：' + JSON.stringify(res));
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
		//console.log('购物车数据：' + JSON.stringify(res));
		
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
// 行踪商品
$('#pnl-cart').delegate('.shop>.mui-checkbox>input[type=checkbox]', 'change', function () {
	var dom = $(this).closest('li.shop');
	
	$(dom).nextUntil('li.shop').find('input[type=checkbox]').prop('checked', $(this).prop('checked'));
});
// 移除购物车
$('#pnl-cart').delegate('.mui-icon-trash', 'tap', function () {
	var dom = $(this).closest('li.shop');
	var ary = [];
	$(dom).nextUntil('li.shop').find('input[type=checkbox]:checked').each(function () {
		ary.push({
			'shop_id'  : $(dom).attr('data-shop'),
			'goods_id' : $(this).closest('li.product').attr('data-product'),
		});
	});
	if (0 == ary.length) { plus.nativeUI.toast('请至少选择一个商品再删除！'); return; }
	
	var key = localStorage.getItem('key');
	console.log('删除购物车商品：' + app.url('mobile/cart/cart_del'));
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/cart/cart_del'),
		'data'     : {'key':key, 'cart':ary}
	})
	.fail(function (res) {
		console.log('删除购物车商品失败：' + JSON.stringify(res));
		app.error('删除购物车商品失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		//console.log('删除购物车商品结果：' + JSON.stringify(res));
		plus.nativeUI.toast('删除成功');
		plus.nativeUI.closeWaiting();
		//cart.refresh();
		$('#pnl-cart').empty().append(template('tpl-cart', res));
	})
	;
});
