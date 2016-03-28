var _Data = {'key':app.store('key'), 'page':0, 'limit':20, 'category':'1', 'lat':'', 'lng':''};

$('header img.btn-category').on('tap', function () {
	$('.classify').slideToggle('fast');
});
$('header img.btn-publish').on('tap', function () {
	app.open('second.hand.publish.html');
});

// 选择不同的分类
$('.classify>ul>li').on('tap', function () {
	var dom = this;
	
	$(dom).removeClass('active').addClass('active').siblings().removeClass('active');
	
	$('#pnl-product').empty();
	_Data.page     = 0;
	_Data.category = $(dom).attr('data-id');
	mui('#refreshContainer').pullRefresh().pullupLoading();
	
	$('.classify').slideToggle('fast');
});

function next (cb) {
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/SecondHand/old_list'),
		'data'     : mui.extend({}, _Data, {'page':_Data.page+1})
	})
	.fail(function (res) {
		console.log('取得二手数据失败：' + JSON.stringify(res));
		app.error('取得二手数据失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('取得二手数据列表：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		_Data.page++;
		cb && cb(res);
	})
	;
}

function funcPullupRefresh () {
	next(function (res) {
		var noMore = _Data.page * _Data.limit >= (res.total||1);
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(noMore);//参数为true代表没有更多数据了。
		
		$('#pnl-product').append(template('tpl-product', res));
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
	plus.geolocation.getCurrentPosition(
		function (res) {
			_Data.lng = res.coords.longitude;
			_Data.lng = res.coords.latitude;
			
			mui('#refreshContainer').pullRefresh().pullupLoading();
		}, 
		function () {
			mui('#refreshContainer').pullRefresh().pullupLoading();
		}, 
		{ provider : 'baidu' }
	);
});

template.helper('image', function (v) {
	return app.link.image + v;
});

// 点击查看转让商品的详细信息
$('#pnl-product').delegate('.product', 'tap', function () {
	var dom = this;
	app.open('second.hand.detail.html', {'id':$(dom).attr('data-id')});
});

