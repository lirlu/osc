var _Data = {'page':0, 'limit':20, 'key':app.store('key')};
mui.init();

template.helper('image', function (v) {
	return app.link.image + v;
});
template.helper('price', function (v) {
	return v / 100;
});

function next (cb) {
	//plus.nativeUI.showWaiting('加载中...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/GroupPurchase/goods_list'),
		'data'     : mui.extend({}, _Data, {'page':_Data.page+1})
	})
	.fail(function (res) {
		console.log('加载团购商品失败：' + JSON.stringify(res));
		app.error('加载团购商品失败');
		//plus.nativeUI.closeWaiting();
		mui('#refreshContainer').pullRefresh().endPullupToRefresh();
	})
	.done(function (res) {
		console.log('加载团购商品：' + JSON.stringify(res));
		//plus.nativeUI.closeWaiting();
		
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
	//console.log('重新刷新页面' + JSON.stringify(_Data));
	$('#pnl-product').empty();
	plus.nativeUI.showWaiting('正在刷新...');
	
	next(function (res) {
		plus.nativeUI.closeWaiting();
		$('#pnl-product').html(template('tpl-product', res));
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();//参数为true代表没有更多数据了。
	});
}
function funcPullupRefresh () {
	next(function (res) {
		$('#pnl-product').append(template('tpl-product', res));
		
		var noMore = _Data.page * _Data.limit >= (res.total||1);
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
	setTimeout(function () {
		mui('#refreshContainer').pullRefresh().pullupLoading();
	}, 1000);
});

// 查看团购商品详情
$('body').delegate('.product', 'tap', function () {
	app.open('group.purchase.detail.html', {'id':$(this).attr('data-id')});
});





