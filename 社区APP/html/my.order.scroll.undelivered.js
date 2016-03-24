// 0带支付 1已付款 2已发货  3已完成 4待评价 5已取消
var _Data = {'page':0, 'limit':15, 'type':'1', 'key':app.store('key')};

function next (cb) {
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/order/order_list'),
		'data'     : _Data
	})
	.fail(function (res) {
		console.log('取得订单数据失败：' + JSON.stringify(res));
		app.error('取得订单数据失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('取得订单数据：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		_Data.page++;
		cb && cb(res);
		$('#tpl-order').append(template('tpl-order', res));
	})
	;
}


function funcPullupRefresh () {
	next(function (res) {
		var noMore = _Data.page * _Data.limit >= (res.total||1);
		$('#pnl-order').append(template('tpl-order', res));
		
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(noMore);//参数为true代表没有更多数据了。
	});
}

mui.init({
	pullRefresh   : {
		container : "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		up        : {
			//contentdown    : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			//contentover    : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			callback       : funcPullupRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		}
	}
});

mui.plusReady(function() {
	setTimeout(reinit,1000);
});

function reinit () {
	$('#pnl-order').empty();
	mui('#refreshContainer').pullRefresh().pullupLoading();
}

template.helper('price', function (v) {
	return v / 100;
});
template.helper('image', function (v) {
	return app.link.image + v;
});
template.helper('time', function (v) {
	return moment(new Date(parseInt(v, 10))).format('YYYY-MM-DD h:mm:ss');
});

// 重新支付订单
$('body').delegate('.product-order .btn-odr-repay', 'tap', function () {
	var dom = this, odr = $(dom).closest('.product-order');
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/order/pay'),
		'data'     : {'order_id':$(odr).attr('data-id'), 'order_no':$(odr).attr('data-no'), 'key':_Data.key}
	})
	.fail(function (res) {
		console.log('重新支付订单失败：' + JSON.stringify(res));
		app.error('重新支付订单失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('重新支付订单：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$(dom).siblings().prop('disabled', true);
		$(dom).prop('disabled', true);
	})
	;
});

// 取消订单支付订单
$('body').delegate('.product-order .btn-odr-cancel', 'tap', function () {
	var dom = this, odr = $(dom).closest('.product-order');
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/order/cancel'),
		'data'     : {'order_id':$(odr).attr('data-id'), 'order_no':$(odr).attr('data-no'), 'key':_Data.key}
	})
	.fail(function (res) {
		console.log('取消支付订单失败：' + JSON.stringify(res));
		app.error('取消支付订单失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('取消支付订单：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$(dom).siblings().prop('disabled', true);
		$(dom).prop('disabled', true);
	})
	;
});

// 确认订单(收到货物)
$('body').delegate('.product-order .btn-odr-confirm', 'tap', function () {
	var dom = this, odr = $(dom).closest('.product-order');
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/order/take_deliver'),
		'data'     : {'order_id':$(odr).attr('data-id'), 'order_no':$(odr).attr('data-no'), 'key':_Data.key}
	})
	.fail(function (res) {
		console.log('取消支付订单失败：' + JSON.stringify(res));
		app.error('取消支付订单失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('取消支付订单：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$(dom).siblings().prop('disabled', true);
		$(dom).prop('disabled', true);
	})
	;
});

// 申请退款
$('body').delegate('.product-order .btn-odr-refund', 'tap', function () {
	var dom  = this, odr = $(dom).closest('.product-order');
	var data = {'order_id':$(odr).attr('data-id'), 'order_no':$(odr).attr('data-no'), 'key':_Data.key};
	
	app.open('refund.html', data);
});

// 评论订单
$('body').delegate('.product-order .btn-odr-comment', 'tap', function () {
	var dom  = this, odr = $(dom).closest('.product-order');
	var data = {'order_id':$(odr).attr('data-id'), 'order_no':$(odr).attr('data-no'), 'key':_Data.key};
	
	app.open('all.appraise.html', data);
});

