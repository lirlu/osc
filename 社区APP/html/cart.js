var cart = {};
cart.add = function (item) {
	var key = app.store('key');
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
		plus.nativeUI.toast('已成功加入购物车');
		plus.nativeUI.closeWaiting();
		
		cart.refresh();
	})
	;
}
cart.remove = function (item) {
	
}
cart.empty = function () {
	
}
cart.refresh = function () {
	var key = app.store('key');
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
// 计算选中商品总价值
cart.total = function () {
	var key = app.store('key');
	var cart = [];
	$('#pnl-cart .product input[name=checkbox]:checked').each(function () {
		cart.push({
			'goods_id' : $(this).closest('.product').attr('data-product')
		});
	});
	
	console.log('计算选中商品总价值：' + app.url('mobile/cart/cart_money'));
	console.log('参数：' + JSON.stringify({'key':key, 'cart':cart}));
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/cart/cart_money'),
		'data'     : {'key':key, 'cart':cart}
	})
	.fail(function (res) {
		console.log('计算选中商品总价值失败：' + JSON.stringify(res));
		app.error('计算选中商品总价值失败');
	})
	.done(function (res) {
		console.log('选中商品总价值：' + JSON.stringify(res));
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		$('span.total').text('￥' + res.money);
	})
	;
}

mui.plusReady(function () {
	//cart.refresh();
	//自动登录后由user.html主动刷新购物车
});
template.helper('image', function (v) {
	return app.link.image + v;
});
template.helper('price', function (v) {
	return parseInt(v, 10) / 100;
});

// 点击商家列表
$('#pnl-cart').delegate('.shop>.image, .shop>.col1', 'tap', function() {
	var data = {
		'shop_id'   : $(this).attr('data-shop')
	};
	app.open('shop.detail1.html', data);
});
// 选中商品
$('#pnl-cart').delegate('.shop .mui-checkbox>input[type=checkbox]', 'change', function () {
	var dom = $(this).closest('li.shop');
	
	$(dom).nextUntil('li.shop').find('input[type=checkbox]').prop('checked', $(this).prop('checked'));
	
	cart.total();
});
// 选中商品
$('#pnl-cart').delegate('.product .mui-checkbox>input[type=checkbox]', 'change', function () {
	cart.total();
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
	
	var key = app.store('key');
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

// 修改商品数量
function setQuantity (quantity, dom) {
	var key = app.store('key');
	var now = parseInt($(dom).text()||'1', 10);
	if (quantity + now < 1) { plus.nativeUI.toast('数量最小只能为1。或者你可以选择删除'); return; }
	
	var cart = [];
	$('#pnl-cart .product input[name=checkbox]:checked').each(function () {
		cart.push({
			'goods_id' : $(this).closest('.product').attr('data-product')
		});
	});

	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/cart/add_num'),
		'data'     : {
			'key'      : key, 
			'num'      : quantity + now,
			'cart'     : cart,
			'goods_id' : $(dom).closest('.product').attr('data-product')
		}
	})
	.fail(function (res) {
		console.log('修改商品数量失败：' + JSON.stringify(res));
		app.error('修改商品数量失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('修改商品数量结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		
		
		$(dom).text(quantity + now);
		//cart.refresh();
		//cart.total();
		$('span.total').text('￥' + (res.money||'0.00'));
	})
	;
}
// 减少数量
$('#pnl-cart').delegate('.quantity-decrease', 'tap', function () {
	setQuantity(-1, $(this).next());
});
// 增加数量
$('#pnl-cart').delegate('.quantity-increase', 'tap', function () {
	setQuantity( 1, $(this).prev());
});
// 增加数量
$('.btn-checkout').on('tap', function () {
	var selected = [];
	$('#pnl-cart .product input[name=checkbox]:checked').each(function () {
		var pro = $(this).closest('.product');
		selected.push({
			'shop_id'  : $(pro).attr('data-shop'),
			'goods_id' : $(pro).attr('data-product')
		});
	});
	if (0 == selected.length) { app.error('请至少选择一个商品再结算'); return; }
	app.open('checkout.html', {'selected':selected});
});
