// 0带支付 1已付款 2已发货  3已完成 4待评价 5已取消
var _Data = {'page':0, 'limit':15, 'type':'4', 'key':app.store('key')};

function next (cb) {
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/order/commont_list'),
		'data'     : _Data
	})
	.fail(function (res) {
		app.log('取得已评论数据失败：' + JSON.stringify(res));
		app.error('取得已评论数据失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('已评论数据：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		_Data.page++;
		cb && cb(res);
	})
	;
}

function funcPulldownRefresh () {
	_Data.page = 0;
	//app.log('重新刷新页面' + JSON.stringify(_Data));
	$('#pnl-order').empty();
	plus.nativeUI.showWaiting('正在刷新...');
	
	next(function (res) {
		plus.nativeUI.closeWaiting();
		$('#pnl-order').html(template('tpl-done', res));
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();//参数为true代表没有更多数据了。
	});
}
function funcPullupRefresh () {
	next(function (res) {
		var noMore = _Data.page * _Data.limit >= (res.total||1);
		$('#pnl-order').append(template('tpl-done', res));
		
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(noMore);//参数为true代表没有更多数据了。
	});
}

mui.init({
	pullRefresh   : {
		container : "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		down      : {
			contentdown    : "下拉可重新加载",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			contentover    : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			callback       : funcPulldownRefresh,
		},
		up        : {
			//contentdown    : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			//contentover    : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			callback       : funcPullupRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		}
	}
});

mui.plusReady(function() {
	setTimeout(init,1000);
});

function init () {
	$('#pnl-order').empty();
	mui('#refreshContainer').pullRefresh().pullupLoading();
}

template.helper('image', function (v) {
	return app.link.image + v;
});

template.helper('rank', function (v) {
	v = parseInt(v, 10);
	var html = '';
	for (var i = 0; i < v; i++) {
		html += '<img src="../img/honxin.png" />';
	}
	for (var i = v; i < 5; i++) {
		html += '<img src="../img/huixin.png" />';
	}
	return html;
});

// 评论订单
$('body').delegate('.product-order .btn-odr-comment', 'tap', function () {
	var dom  = this, odr = $(dom).closest('.product-order');
	var data = {'order_id':$(odr).attr('data-id'), 'order_no':$(odr).attr('data-no'), 'key':_Data.key};
	
	app.open('goods.appraise.html', data);
});

// 查看商品详情
$('body').delegate('.product img', 'tap', function () {
	var dom = $(this).closest('.product');
	
	var data = {
		'shop_id'  : $(dom).attr('data-shop'), 
		'goods_id' : $(dom).attr('data-product'),
		'name'     : '',
	};
	app.open('goods.detail.html', data);
});

