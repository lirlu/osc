//1表示送水  2表示家政中心 3干洗水洗 4汽车服务 5便捷中心 5商超
var _Data = {'shop_id':'', 'page':0, 'cate_id':'', 'limit':9999, 'type':''};
template.helper('image', function (v) {
	return app.link.image + v;
});
template.helper('price', function (v) {
	return v / 100;
});
$('.btn-like').on('tap', function () {
	var view = plus.webview.currentWebview();
	if (!app.store('key')) { plus.nativeUI.toast('只有登录后才能收藏商家'); return;}
	
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/shop_collection'),
		'data'     : {'key':app.store('key'), 'shop_id':view.extras.shop_id}
	})
	.fail(function (res) {
		app.log('收藏商家失败：' + JSON.stringify(res));
		app.error('收藏商家失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('收藏结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		if (res.msg) { plus.nativeUI.toast(res.msg); }
		
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
		'type'     : _Data.type,
	};
	//app.log('参数：' + JSON.stringify(data));
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
	
	app.log('获取商品分类数据：' + app.url('mobile/goods/cate_goods'));
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/goods/cate_goods'),
		'data'     : {'page':page++, shop_id:data.shop_id}
	})
	.fail(function (res) {
		app.log('获取商品分类数据失败：' + JSON.stringify(res));
		app.error('获取商品分类数据失败');
		plus.nativeUI.closeWaiting();
		//mui('#refreshContainer').pullRefresh().endPullupToRefresh();
		//mui('#refreshContainer').pullRefresh().endPullupToRefresh();
	})
	.done(function (res) {
		//app.log('商品分类数据：' + JSON.stringify(res));
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
	
	app.log('查询商品列表参数：' + JSON.stringify(mui.extend({}, _Data, {'page':_Data.page+1})));
	$.ajax({
		'dataType' : 'json',
		'type'     : 'get',
		'url'      : app.url('mobile/goods/goods_list'),
		'data'     : mui.extend({}, _Data, {'page':_Data.page+1})
	})
	.fail(function (res) {
		app.log('获取商超的商品数据失败：' + JSON.stringify(res));
		app.error('获取商超的商品数据失败');
		plus.nativeUI.closeWaiting();
		//mui('#refreshContainer').pullRefresh().endPullupToRefresh();
		//mui('#refreshContainer').pullRefresh().endPullupToRefresh();
	})
	.done(function (res) {
		//app.log('商品数据：' + JSON.stringify(res));
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
	//1表示送水  2表示家政中心 3干洗水洗 4汽车服务 5便捷中心 5商超
	if (view.extras._FROM_.indexOf('station') > -1) {
		_Data.type = 1;// 送水
	} else if (view.extras._FROM_.indexOf('homemaking') > -1) {
		_Data.type = 2;// 家政中心
	} else if (view.extras._FROM_.indexOf('wash.clothes') > -1) {
		_Data.type = 3;// 水洗干活
	} else if (view.extras._FROM_.indexOf('car.service') > -1) {
		_Data.type = 4;// 汽车服务
	} else if (view.extras._FROM_.indexOf('convenient') > -1) {
		_Data.type = 5;// 便捷中心
	} else if (view.extras._FROM_.indexOf('shoper') > -1) {
		_Data.type = 6;// 联盟商家
	} else {
		_Data.type = 0;// 附近商超
	}
	
	// 客户说联盟商家时如果不是商超就没有分类
	if (6 == _Data.type && '0' != view.extras.type) {
		$('#pnl-category').parent().hide();
		$('.mui-scroll-wrapper').parent().width('100%');
	}
	// 修改头部式样
	if (0 != _Data.type) {
		//$('.mui-pull-right').hide();
		$('.mui-action-back').append(data.shop_name);
		// 商家信息
		$('#shop_name').text(data.shop_name).hide();
	} else {
		// 商家信息
		$('#shop_name').text(data.shop_name);
	}
	
	product(function (res) {
		$('#shop_name').attr('data-lng', res.seller_view.lng).attr('data-lat', res.seller_view.lat);
		
		// 商家信息
		$('#pnl-duty-info').html(template('tpl-duty-info', res));
		$('.startime>img').attr('src', '../img/i-clock.png').addClass('small-WTF');
		
		//左侧分类数据
		$('#pnl-category').html(template('tpl-category', res));
		if (0 != _Data.type) {
			$('.all-category').text('分类').addClass('WTF');
		}
		
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
$('body').delegate('.btn-call-seller, .btn-call-image', 'tap', function (e) {
	e.stopPropagation();
	var num = $(this).closest('.shoper').find('.btn-call-seller').text();
	plus.device.dial(num, true);
});
// 快速回到首页
$('.btn-home').on('tap', function () {
	$(this).prop('disabled', true);
	plus.webview.getWebviewById('home.html').evalJS('app.home()');
});






