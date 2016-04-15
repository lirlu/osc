var _Data = {'key':app.store('key'), page:0, limit:10};

function next (cb) {
	var key = app.store('key');
	
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/chongzhi_log'),
		'data'     : mui.extend({}, _Data, {'page':_Data.page+1})
	})
	.fail(function (res) {
		app.log('刷新充值纪录失败：' + JSON.stringify(res));
		app.error('刷新充值纪录失败');
		mui('#refreshContainer').pullRefresh().endPullupToRefresh();
	})
	.done(function (res) {
		app.log('刷新充值纪录结果：' + JSON.stringify(res));
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) { app.error(res.msg); return;}
		
		_Data.page++;
		cb && cb(res);
	})
	;
}

function funcPulldownRefresh () {
	_Data.page = 0;
	//app.log('重新刷新页面' + JSON.stringify(_Data));
	$('#pnl-record').empty();
	plus.nativeUI.showWaiting('正在刷新...');
	
	next(function (res) {
		plus.nativeUI.closeWaiting();
		$('#pnl-record').html(template('tpl-record', {data:res.list}));
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();//参数为true代表没有更多数据了。
	});
}
function funcPullupRefresh () {
	next(function (res) {
		var noMore = _Data.page * _Data.limit >= (res.total||0);
		$('#pnl-record').append(template('tpl-record', {data:res.list}));
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

mui.plusReady(function () {
	if (mui.os.android) {
		setTimeout(function () {
			mui('#refreshContainer').pullRefresh().pullupLoading();
		},1000);
	} else {
		setTimeout(function () {
			mui('#refreshContainer').pullRefresh().pullupLoading();
		},100);
	}
});