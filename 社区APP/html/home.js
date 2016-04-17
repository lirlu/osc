// 普通页面跳转
$('body').delegate("[data-url]", 'tap', function() {
	app.open($(this).attr('data-url'));
});
// 跳转到需要登录才能操作的页面
$('body').delegate('[data-private]', 'tap', function () {
	if (!app.store('key')) {
		plus.nativeUI.toast('请先登录！');
		app.open('log.html');
		return;
	}
	app.open($(this).attr('data-private'));
});
// 跳转到外部页面
$('body').delegate('[data-outer]', 'tap', function () {
	app.open('outer.html', {'url':$(this).attr('data-outer'), 'name':$(this).attr('data-name')});
});

// 刷新城市
function init (city) {
	// 取得轮播图数据和推荐商家商品数据
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/index/banner'),
		'data'     : {}
	})
	.fail(function (res) {
		app.log('取得轮播图失败：' + JSON.stringify(res));
	})
	.done(function (res) {
		app.log('首页数据：' + JSON.stringify(res));
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('#pnl-banner').html(template('tpl-banner', res));
		$('#pnl-gallery').html(template('tpl-gallery', res));
		$('#pnl-thumb').html(template('tpl-thumb', res));
		
		mui('#banner-container .mui-slider').slider({interval:5000});
	})
	;
	
	if (city) {
		$('header .left span').text(city.text);
		return;
	}
	app.locate(function (res) {
		var addr = res.address || {};
		$('header .left span').text(addr.street || addr.district || addr.city || addr.province);
	});
}

mui.plusReady(init);

// 用户签到
$('.btn-sigin').on('tap', function () {
	var key = app.store('key');
	if (!key) { plus.nativeUI.toast('请先登录!'); return; }
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/qiandao'),
		'data'     : {'key':key }
	})
	.fail(function (res) {
		app.log('签到失败：' + JSON.stringify(res));
		app.error('签到失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('签到结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
	})
	;
});

// 点击进入商家
$('#pnl-banner, #pnl-slider, #pnl-gallery, #pnl-thumb').delegate('.shop', 'tap', function () {
	var dom = this;
	var data = {
		'id'    : $(dom).attr('data-id'),
		'title' : $(dom).attr('data-title') || ' ',
	};
	if (!data.id || '0' == data.id) { return; }
	app.open('shop.information.html', data);
});
// 点击进入商品
$('#pnl-banner, #pnl-slider, #pnl-gallery, #pnl-thumb').delegate('.product', 'tap', function () {
	var dom = this;
	var data = {
		'shop_id'  : '', 
		'goods_id' : $(dom).attr('data-id'),
		'name'     : $(dom).attr('data-title') || ' ',
	};
	if (!data.goods_id || '0' == data.goods_id) { return; }
	app.open('goods.detail.html', data);
});

template.helper('image', function (v) {
	return app.link.image + v;
});
