var page = 0;
function search (cb) {
	//console.log('定位数据：' + localStorage.getItem('LocationAddress'));
	var addr = JSON.parse(localStorage.getItem('LocationAddress'));
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/supermarketseller/superseller'),
		'data'     : {
			page : page++,
			lat  : addr.coords.latitude,
			lng  : addr.coords.longitude
		}
	})
	.fail(function (res) {
		console.log('加载附近商超失败：' + JSON.stringify(res));
		app.error('加载附近商超失败');
		plus.nativeUI.closeWaiting();
		page--;
		mui('#refreshContainer').pullRefresh().endPullupToRefresh();
		mui('#refreshContainer').pullRefresh().endPullupToRefresh();
	})
	.done(function (res) {
		console.log('附近商超：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		cb && cb(res);
	})
	;
}

function funcPullUp () {
	search(function (res) {
		if (res.error.msg) { plus.nativeUI.toast(res.error.msg); }
		
		$('#pnl-nearby-store').prepend(template('tpl-nearby-store', res));
		// 参数为true表示没有更多的数据了
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
		//mui('#refreshContainer').pullRefresh().disablePullupToRefresh();
	});
}
function funcPullDown () {
	search(function (res) {
		if (res.error.msg) { plus.nativeUI.toast(res.error.msg); }
		
		$('#pnl-nearby-store').prepend(template('tpl-nearby-store', res));
		// 参数为true表示没有更多的数据了
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh(false);
		//mui('#refreshContainer').pullRefresh().disablePullupToRefresh();
	});
}
mui.init({
	pullRefresh: {
		container: '#refreshContainer', //待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
		up: {
			contentrefresh : "正在加载...",
			contentnomore  : '没有更多数据了',
			callback       : funcPullUp
		},
		down: {
			contentdown    : "下拉可以刷新",
			contentrefresh : "正在刷新...",
			contentover    : "释放立即刷新",
			callback       : funcPullDown
		}
	}
});

// 点击商家列表
$('body').delegate('[address]', 'tap', function() {
	app.open($(this).attr('address'));
});


mui.plusReady(function () {
	// 加载附近商超
	plus.nativeUI.showWaiting("等待中...");
	// plus.geolocation.getCurrentPosition(function(res) {});
	app.locate(function (pos) {
		setTimeout(function () {
			mui('#refreshContainer').pullRefresh().pulldownLoading();
		}, 1000);
	});
});
