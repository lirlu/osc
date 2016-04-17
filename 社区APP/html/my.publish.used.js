var _Data = {'lat':'', 'lng':'', 'key':app.store('key'), 'page':0, 'limit':20, 'category':''};
mui.init();

function next (cb) {
	app.log('查询数据：' + JSON.stringify(_Data));
	//plus.nativeUI.showWaiting('加载中...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/old_list'),
		'data'     : mui.extend({}, _Data, {'page':_Data.page+1})
	})
	.fail(function (res) {
		app.log('取得我的二手失败：' + JSON.stringify(res));
		app.error('取得我的二手失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('我的二手：' + JSON.stringify(res));
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
	$('#pnl-used').empty();
	plus.nativeUI.showWaiting('正在刷新...');
	
	next(function (res) {
		plus.nativeUI.closeWaiting();
		$('#pnl-used').html(template('tpl-used', res));
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();//参数为true代表没有更多数据了。
	});
}
function funcPullupRefresh () {
	next(function (res) {
		var noMore = _Data.page * _Data.limit >= (res.total||1);
		
		if (_Data.page == 1) {
			$('#pnl-used').html(template('tpl-used', res));
		} else {
			$('#pnl-used').append(template('tpl-used', res));
		}
		
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

template.helper('avatar', function (v) {
	return v ? (app.link.image + v) : '../img/iconfont-morentouxiang.png';
});

$('body').delegate('.product', 'tap', function () {
	app.open('second.hand.detail.html', {'id':$(this).attr('data-id')});
});

$('body').delegate('.btn-sold', 'tap', function (e) {
	var dom = this; e.stopPropagation();
	plus.nativeUI.showWaiting('正在提交...');
	$(dom).prop('disabled', true);
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/old_sold'),
		'data'     : {'key':app.store('key'), 'id':$(dom).closest('.product').attr('data-id')}
	})
	.fail(function (res) {
		app.log('更新转让信息失败：' + JSON.stringify(res));
		app.error('更新转让信息失败');
		plus.nativeUI.closeWaiting();
		$(dom).prop('disabled', false);
	})
	.done(function (res) {
		app.log('更新转让信息：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$(dom).remove();
	})
	;
});

$('body').delegate('.btn-sell', 'tap', function (e) {
	var dom = this; e.stopPropagation();
	plus.nativeUI.showWaiting('正在提交...');
	$(dom).prop('disabled', true);
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/old_sell'),
		'data'     : {'key':app.store('key'), 'id':$(dom).closest('.product').attr('data-id')}
	})
	.fail(function (res) {
		app.log('更转让信息失败：' + JSON.stringify(res));
		app.error('更转让信息失败');
		plus.nativeUI.closeWaiting();
		$(dom).prop('disabled', false);
	})
	.done(function (res) {
		app.log('更新转让信息：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$(dom).remove();
	})
	;
});




