var _Data = {'tab':'', 'page':0, 'limit':15, 'key':app.store('key'), 'cate_id':'', 'lat':'', 'lng':'', 'type':''}
// 查询拼车服务
function next (cb) {
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/index/pingche'),
		'data'     : mui.extend({}, _Data, {'page':_Data.page+1})
	})
	.fail(function (res) {
		app.log('取得拼车服务失败：' + JSON.stringify(res));
		app.error('取得拼车服务失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('拼车服务：' + JSON.stringify(res));
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
	$('#pnl-shop').empty();
	plus.nativeUI.showWaiting('正在刷新...');
	
	next(function (res) {
		plus.nativeUI.closeWaiting();
		$('#pnl-shop').html(template('tpl-carpool', res));
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();//参数为true代表没有更多数据了。
	});
}
function funcPullupRefresh () {
	next(function (res) {
		var noMore = _Data.page * _Data.limit >= (res.total||1);
		
		if (_Data.page == 1) {
			$('#pnl-shop').html(template('tpl-carpool', res));
		} else {
			$('#pnl-shop').append(template('tpl-carpool', res));
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

function init (data) {
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
			
			init ();
		}, 
		function () {
			init ();
		}, 
		{ provider : 'baidu' }
	);
});

template.helper('image', function (v) {
	return v ? (app.link.image + v) : '../img/iconfont-morentouxiang.png';
});

function toggleCarpoolType () {
	// 显示拼车类型选择
	$('ul.type').toggleClass('mui-hidden');
}

// 选择拼车服务
$('.btn-take-ride').on('tap', function () {
	$('#pnl-shop').empty(); data.page = 0;
	mui('#refreshContainer').pullRefresh().pullupLoading();
});

// 点击拼车信息
$('#pnl-shop').delegate('.carpool', 'tap', function() {
	var data = {
		'id'   : $(this).attr('data-id'),
		'type' : $(this).attr('data-type'),
	};
	
	if ('owner' == $(this).attr('data-type')) {
		app.open('publish.owner.html', data);
	} else {
		app.open('publish.passenger.html', data);	
	}
});

$('ul.type input[type=radio]').on('change', function () {
	toggleCarpoolType();
	_Data.type = $('ul.type input[type=radio]:checked').val();
	init();
});


