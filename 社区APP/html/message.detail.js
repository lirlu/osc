mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/view'),
		'data'     : {key:app.store('key'), id:view.extras.id}
	})
	.fail(function (res) {
		app.log('取得消息内容失败：' + JSON.stringify(res));
		app.error('取得消息内容失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('消息内容：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('.headline').append(res.view.title);
		$('.timeline').append(res.view.add_time);
		$('.message-text').append(res.view.content);
	})
	;
});