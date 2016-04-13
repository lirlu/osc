mui.init();

// 提交评论
$('.btn-submit').on('tap', function () {
	var dom = this, view = plus.webview.currentWebview();
	var data = {
		'key'      : app.store('key'),
		'content'  : $('[name=note]').val(),
		'forum_id' : view.extras.id,
		'uid'      : view.extras.at,
	}
	plus.nativeUI.showWaiting('正在提交...');
	$(dom).prop('disabled', true);
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/forum/forum_comment'),
		'data'     : data
	})
	.fail(function (res) {
		console.log('评论帖子失败：' + JSON.stringify(res));
		app.error('评论帖子失败');
		plus.nativeUI.closeWaiting();
		$(dom).prop('disabled', false);
	})
	.done(function (res) {
		console.log('评论帖子：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		$(dom).prop('disabled', false);
		
		if (res.error && res.error.msg) { plus.nativeUI.toast(res.error.msg); return; }
		if (res.msg) { plus.nativeUI.toast(res.msg); }
		
		var prev = view.extras._FROM_;
		try {
			plus.webview.getWebviewById(prev).evalJS('after_comment('+JSON.stringify(data)+')');
		} catch (e) {}
		setTimeout(function () { plus.webview.currentWebview().close(); }, 200);
	})
	;
});
