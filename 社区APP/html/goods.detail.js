mui.init();
$('ul#pnl-related').delegate('li', 'tap', function () {
	var data = {
		'shop_id'  : $(this).attr('data-shop'),
		'goods_id' : $(this).attr('data-product'),
		'name'     : $(this).attr('data-name'),
	};
	
	init(data);
});
// 收藏按钮
$('body').delegate('#stars', 'tap', function() {
	if (!app.store('key')) {
		app.open('log.html');
	} else {
		app.open('goods.detail.html');
	};
});
// 加入购物车
$('#pnl-product').delegate('.add-to-cart', 'tap', function() {
	if (!app.store('key')) {
		app.open('log.html');
	} else {
		var dom = $('#pnl-product .product-data');
		var data = {
			'shop_id'  : $(dom).attr('data-shop'),
			'goods_id' : $(dom).attr('data-product'),
		};
		plus.webview.getWebviewById('cart.html').evalJS('cart.add('+JSON.stringify(data)+')');
	};
});
// 查看评价
$('.content').delegate('.view-comment', 'tap', function() {
	app.open('goods.appraise.html');
});
// 重新初始化页面
function init (data) {
	plus.nativeUI.showWaiting('请等待...');
	
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
		
		//设置title值
		$('#title').text(res.goods_info.title);
		// 商品信息
		$('#pnl-product').empty().append(template('tpl-product', res));
		// 也许你还喜欢
		$('#pnl-related').empty().append(template('tpl-related', res));
	})
	;
}
mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	
	init(view.extras);
});
template.helper('image', function (v) {
	return app.link.image + v;
});