mui.init();

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	plus.nativeUI.showWaiting('加载中...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/index/pingche_view'),
		'data'     : { 'key':app.store('key'),'id':view.extras.id }
	})
	.fail(function (res) {
		console.log('读取拼车信息失败：' + JSON.stringify(res));
		app.error('读取拼车信息');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('拼车信息：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('#pnl-publish').empty().append(template('tpl-publish', res));
	})
	;
});

template.helper('image', function (v) {
	return v ? (app.link.image + v) : '../img/iconfont-morentouxiang.png';
});

$('body').delegate('.btn-call', 'tap', function () {
	plus.device.dial($(this).text(), true);
});

