var _Data = {};

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
		app.open('log.html'); return;
	}
	
	// 收藏
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/goods/collection'),
		'data'     : {
			'key'      : app.store('key'),
			'shop_id'  : _Data.shop_id,
			'goods_id' : _Data.goods_id,
		}
	})
	.fail(function (res) {
		app.log('收藏失败：' + JSON.stringify(res));
		app.error('收藏失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		//app.log('收藏结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		if (res.liked) {
			$('#stars .stars').addClass('hong_star');
		} else {
			$('#stars .stars').removeClass('hong_star');
		}
	})
	;
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
// 给商家打电话
$('body').delegate('.btn-call-seller', 'tap', function () {
	plus.device.dial($(this).attr('data-tel'), true);
});
// 立即购买
$('body').delegate('.btn-buy-now', 'tap', function () {
	if (!app.store('key')) {
		app.open('log.html');
	} else {
		var dom = $('#pnl-product .product-data');
		var selected = [{
			'shop_id'  : $(dom).attr('data-shop'),
			'goods_id' : $(dom).attr('data-product'),
			'num'      : 1,
		}];
		app.open('checkout.html', {'selected':selected});
	};
});

// 查看评价
$('.content').delegate('.view-comment', 'tap', function() {
	//app.open('goods.appraise.html');
	app.open('product.comment.html', _Data);
});
// 重新初始化页面
function init (data) {
	_Data = data;
	plus.nativeUI.showWaiting('请等待...');
	if (0 != data.type) {
		//$('.mui-pull-right').hide();
	}
	
	// 商品详情
	app.log('请求商品详情数据：' + app.url('mobile/goods/goods_view'));
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
		app.log('请求商品详情数据失败：' + JSON.stringify(res));
		app.error('请求商品详情数据失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('商品详情数据：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		//设置title值
		if (0 != data.type) {
			$('.mui-action-back').append(res.goods_info.title)
		} else {
			$('#title').text(res.goods_info.title);
		}
		
		// 商品信息
		$('#pnl-product').empty().append(template('tpl-product', res));
		mui.previewImage();
		// 也许你还喜欢
		$('#pnl-related').empty().append(template('tpl-related', res));
		
		if (res.goods_info.is_collection) { $('#stars .stars').addClass('hong_star'); }
	})
	;
}
// 快速回到首页
$('.btn-home').on('tap', function () {
	$(this).prop('disabled', true);
	plus.webview.getWebviewById('home.html').evalJS('app.home()');
});
mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	
	init(view.extras);
});
template.helper('image', function (v) {
	return app.link.image + v;
});
template.helper('price', function (v) {
	return v / 100;
});