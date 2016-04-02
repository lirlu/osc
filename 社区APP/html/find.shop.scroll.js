var _Data = {'lat':'', 'lng':'', 'page':0, 'limit':15, 'type':'', 'key':app.store('key'), 'keyword':''};

function next (cb) {
	//plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/goods/search'),
		'data'     : _Data
	})
	.fail(function (res) {
		console.log('按条件搜索商家失败：' + JSON.stringify(res));
		app.error('按条件搜索商家失败');
		//plus.nativeUI.closeWaiting();
		mui('#refreshContainer').pullRefresh().endPullupToRefresh();
	})
	.done(function (res) {
		console.log('搜索结果：' + JSON.stringify(res));
		//plus.nativeUI.closeWaiting();
		mui('#refreshContainer').pullRefresh().endPullupToRefresh();
		
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
		$('#pnl-shop').append(template('tpl-shop', res));
		
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

mui.plusReady(function () {
	plus.geolocation.getCurrentPosition(
		function (res) {
			_Data.lng = res.coords.longitude;
			_Data.lat = res.coords.latitude;
			
			init ();
		}, 
		function () {
			init ();
		}, 
		{ provider : 'baidu' }
	);
});

function init (data) {
	data = data || {};
	_Data.keyword = data.keyword || '';
	_Data.page = 0;
	$('#pnl-shop').empty();
	mui('#refreshContainer').pullRefresh().pullupLoading();
}

template.helper('avatar', function (v) {
	return v ? (app.link.image + v) : '../img/iconfont-morentouxiang.png';
});
template.helper('image', function (v) {
	return app.link.image + v;
});