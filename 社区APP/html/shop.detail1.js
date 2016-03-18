var page = 0, cate_id = '';
template.helper('image', function (v) {
	return app.link.image + v;
});
// 页面跳转
$('body').delegate("[address]", 'tap', function() {
	app.open($(this).attr('address'));
});

$('.content').delegate(' .startime', 'tap', function() {	
	$(this).siblings('.startime1').toggle();
});

//点击一级列表
$('body').delegate('.left-div li', 'tap', function() {

	$(this).addClass('active1').css('background', '#eee').siblings().removeClass('active1').css('background', '');
	// 查看分类下的商品数据
	page = 0, cate_id = $(this).attr('data-name');
	
	product(function (res) {
		// 右侧商品数据
		$('#pnl-product').html(template('tpl-product', res));
	});
});

// 分类列表
function category (cb) {
	var view = plus.webview.currentWebview();
	var data = self.extras;
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
		page--;
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
	
	console.log('获取商超的商品数据：' + app.url('mobile/goods/goods_list'));
	console.log(JSON.stringify({'page':page++, 'shop_id':data.shop_id, 'cate_id':cate_id}));
	$.ajax({
		'dataType' : 'json',
		'type'     : 'get',
		'url'      : app.url('mobile/goods/goods_list'),
		'data'     : {'page':page++, 'shop_id':data.shop_id, 'cate_id':cate_id}
	})
	.fail(function (res) {
		//console.log('获取商超的商品数据失败：' + JSON.stringify(res));
		app.error('获取商超的商品数据失败');
		plus.nativeUI.closeWaiting();
		page--;
		//mui('#refreshContainer').pullRefresh().endPullupToRefresh();
		//mui('#refreshContainer').pullRefresh().endPullupToRefresh();
	})
	.done(function (res) {
		console.log('商品数据：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		cb && cb(res);
	})
	;
}

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	var data = view.extras;
	
	// 商家信息
	$('#shop_name').text(data.shop_name);
	
	product(function (res) {
		// 商家信息
		$('#pnl-duty-info').html(template('tpl-duty-info', res));
		
		//左侧分类数据
		$('#pnl-category').html(template('tpl-category', res));
		
		// 右侧商品数据
		$('#pnl-product').html(template('tpl-product', res));
	});
});





