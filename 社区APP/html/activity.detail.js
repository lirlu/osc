mui.plusReady(function () {
	var extras = plus.webview.currentWebview().extras;
	
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/Property/activity_view'),
		'data'     : {'key':app.store('key'), 'id':extras.id}
	})
	.fail(function (res) {
		app.log('取得活动详情失败：' + JSON.stringify(res));
		app.error('取得活动详情失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('活动详情：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('.content').html(template('tpl-activity', res));
	})
	;
});

template.helper('avatar', function (v) {
	return v ? (app.link.image + v) : '../img/iconfont-morentouxiang.png';
});
template.helper('image', function (v) {
	return app.link.image + v;
});