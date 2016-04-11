var _Data = {'type':'', 'page':0, 'limit':20, 'key':app.store('key'), 'cate_id':'', 'lat':'', 'lng':''}
function search (cb) {
	plus.nativeUI.showWaiting("等待中...");
	console.log('请求附近商超数据：' + app.url('mobile/supermarketseller/superseller'));
	$.ajax({
		'dataType' : 'json',
		'type'     : 'get',
		'url'      : app.url('mobile/supermarketseller/superseller'),
		'data'     : mui.extend({}, _Data, {'page':_Data.page+1})
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
		
		_Data.page++;
		cb && cb(res);
	})
	;
}

function funcPullUp () {
	search(function (res) {
		if (200 != res.code) { plus.nativeUI.toast('请求数据失败'); return; }
		var noMore = _Data.page * _Data.limit >= (res.sellerCount||1);
		
		$('#pnl-nearby-store').prepend(template('tpl-nearby-store', res));
		// 参数为true表示没有更多的数据了
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(noMore);//参数为true代表没有更多数据了。
	});
}
function funcPullDown () {
	search(function (res) {
		if (200 != res.code) { plus.nativeUI.toast('请求数据失败'); return; }
		
		$('#pnl-nearby-store').append(template('tpl-nearby-store', res));
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
$('#pnl-nearby-store').delegate('.shop', 'tap', function() {
	var data = {
		'shop_id'   : $(this).attr('shop_id'),
		'shop_name' : $(this).attr('shop_name'),
		'addr'      : $(this).attr('addr'),
		'tel'       : $(this).attr('tel'),
	};
	app.open('shop.detail1.html', data);
});


mui.plusReady(function () {
	plus.geolocation.getCurrentPosition(
		function (res) {
			_Data.lat = res.coords.latitude;
			_Data.lng = res.coords.longitude;
			
			mui('#refreshContainer').pullRefresh().pullupLoading();
		}, 
		function () {
			plus.nativeUI.toast('定位失败');
			mui('#refreshContainer').pullRefresh().pullupLoading();
		}, 
		{ provider : 'baidu' }
	);
});
template.helper('image', function (v) {
	return app.link.image + v;
});






