var _Data = {'lat':'', 'lng':'', 'key':app.store('key'), 'page':0, 'limit':20, 'category':''};
mui.init();

function next (cb) {
	console.log('查询数据：' + JSON.stringify(_Data));
	//plus.nativeUI.showWaiting('加载中...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/index/gs_seller'),
		'data'     : mui.extend({}, _Data, {'page':_Data.page})
	})
	.fail(function (res) {
		console.log('取得干洗水洗商家失败：' + JSON.stringify(res));
		app.error('取得干洗水洗商家失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('干洗水洗商家：' + JSON.stringify(res));
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
		
		if (_Data.page == 1) {
			$('#pnl-shop').html(template('tpl-shop', res));
		} else {
			$('#pnl-shop').append(template('tpl-shop', res));
		}
		
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

function reinit (data) {
	data = data || {};
	_Data.page    = 0;
	_Data.cate_id = data.category || '';
	
	//$('#pnl-shop').empty();
	mui('#refreshContainer').pullRefresh().pullupLoading();
}

mui.plusReady(function () {
	plus.geolocation.getCurrentPosition(
		function (res) {
			_Data.lng = res.coords.longitude;
			_Data.lat = res.coords.latitude;
			
			reinit ();
		}, 
		function () {
			reinit ();
		}, 
		{ provider : 'baidu' }
	);
});

template.helper('image', function (v) {
	return v ? (app.link.image + v) : '../img/iconfont-morentouxiang.png';
});

// 点击商家列表
$('body').delegate('.shop', 'tap', function() {
	var data = {
		'shop_id'   : $(this).attr('data-id'),
		'shop_name' : $(this).attr('data-name'),
	};
	app.open('shop.information.html', data);
});





