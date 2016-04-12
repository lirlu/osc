var _Data = {'shop_id':'', 'page':0, 'cate_id':'', 'limit':9999};
template.helper('image', function (v) {
	return app.link.image + v;
});
template.helper('price', function (v) {
	return v / 100;
});
$('.btn-like').on('tap', function () {
	var view = plus.webview.currentWebview();
	if (!app.store('key')) { plus.nativeUI.toast('只有登录后才能收藏商家'); return;}
	
	plus.nativeUI.toast('收藏商家成功');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/shop_collection'),
		'data'     : {'key':app.store('key'), 'shop_id':view.extras.shop_id}
	})
	.fail(function (res) {
		console.log('收藏商家失败：' + JSON.stringify(res));
		app.error('收藏商家失败');
	})
	.done(function (res) {
		console.log('收藏结果：' + JSON.stringify(res));
		if (res.liked) {
			$('.btn-like').attr('src', '../img/iconfont-liked.png');
		} else {
			$('.btn-like').attr('src', '../img/iconfont-like.png');
		}
	})
	;
});
// 页面跳转
$('#pnl-product').delegate(".goods", 'tap', function() {
	var view = plus.webview.currentWebview();
	
	var data = {
		'shop_id'  : view.extras.shop_id, 
		'goods_id' : $(this).attr('goods_id'),
		'name'     : $(this).attr('title'),
	};
	//console.log('参数：' + JSON.stringify(data));
	app.open('goods.detail.html', data);
});

$('.content').delegate(' .startime', 'tap', function() {	
	$(this).siblings('.startime1').toggle();
});

//点击一级列表
$('body').delegate('#pnl-category li', 'tap', function() {

	$(this).addClass('active1').css('background', '#eee').siblings().removeClass('active1').css('background', '');
	// 查看分类下的商品数据
	_Data.page = 0;
	_Data.cate_id = $(this).attr('data-name');
	
	$('#pnl-product').empty();
	product(function (res) {
		// 右侧商品数据
		$('#pnl-product').html(template('tpl-product', res));
	});
});

// 分类列表
function category (cb) {
	var view = plus.webview.currentWebview();
	var data = view.extras;
	plus.nativeUI.showWaiting('请等待...');
	
	console.log('获取商品分类数据：' + app.url('mobile/goods/cate_goods'));
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/goods/cate_goods'),
		'data'     : {'page':page++, shop_id:data.shop_id}
	})
	.fail(function (res) {
		console.log('获取商品分类数据失败：' + JSON.stringify(res));
		app.error('获取商品分类数据失败');
		plus.nativeUI.closeWaiting();
		//mui('#refreshContainer').pullRefresh().endPullupToRefresh();
		//mui('#refreshContainer').pullRefresh().endPullupToRefresh();
	})
	.done(function (res) {
		//console.log('商品分类数据：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		cb && cb(res);
	})
	;
}
// 商品列表
function product (cb) {
	var view = plus.webview.currentWebview();
	var data = view.extras;
	plus.nativeUI.showWaiting('请等待...');
	
	//console.log('查询商品列表参数：' + JSON.stringify(mui.extend({}, _Data, {'page':_Data.page+1})));
	$.ajax({
		'dataType' : 'json',
		'type'     : 'get',
		'url'      : app.url('mobile/goods/goods_list'),
		'data'     : mui.extend({}, _Data, {'page':_Data.page+1})
	})
	.fail(function (res) {
		console.log('获取商超的商品数据失败：' + JSON.stringify(res));
		app.error('获取商超的商品数据失败');
		plus.nativeUI.closeWaiting();
		//mui('#refreshContainer').pullRefresh().endPullupToRefresh();
		//mui('#refreshContainer').pullRefresh().endPullupToRefresh();
	})
	.done(function (res) {
		//console.log('商品数据：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		_Data.page++;
		cb && cb(res);
	})
	;
}

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	var data = view.extras;
	_Data.shop_id = data.shop_id;
	
	// 商家信息
	$('#shop_name').text(data.shop_name);
	
	product(function (res) {
		$('#shop_name').attr('data-lng', res.seller_view.lng).attr('data-lat', res.seller_view.lat);
		
		// 商家信息
		$('#pnl-duty-info').html(template('tpl-duty-info', res));
		
		//左侧分类数据
		$('#pnl-category').html(template('tpl-category', res));
		
		// 右侧商品数据
		$('#pnl-product').html(template('tpl-product', res));
		
		// 是否已经收藏
		if (res.seller_view.is_collection) { $('.btn-like').attr('src', '../img/iconfont-liked.png'); }
	
		mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
	});
});

$('body').delegate('.btn-shop-location', 'tap', function () {
	var data = {
		'addr' : $(this).text(),
		'name' : $('#shop_name').text(),
		'lng'  : $('#shop_name').attr('data-lng'),
		'lat'  : $('#shop_name').attr('data-lat'),
	}
	app.open('shop.location.html', data);
});
// 给商家打电话
$('body').delegate('.btn-call-seller', 'tap', function () {
	plus.device.dial($(this).text(), true);
});
// 快速回到首页
$('.btn-home').on('tap', function () {
	app.home();
});






