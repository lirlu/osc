mui.init();

function refresh (data) {
	plus.nativeUI.showWaiting('加载中...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/SecondHand/goods_view'),
		'data'     : {'key':app.store('key'), 'id':data.id}
	})
	.fail(function (res) {
		console.log('取得二手详情失败：' + JSON.stringify(res));
		app.error('取得二手详情失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('二手详情：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('#pnl-information').empty().append(template('tpl-information', res));
	})
	;
}

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	
	refresh({'id':view.extras.id});
});

template.helper('image', function (v) {
	return v ? (app.link.image + v) : '../img/iconfont-morentouxiang.png';
});
template.helper('price', function (v) {
	return v / 100;
});

// 联系卖家
$('body').delegate('[data-call]', 'tap', function () {
	plus.device.dial($(this).attr('data-call'), true);
});


