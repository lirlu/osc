var _Data = {'key':app.store('key'), 'page':0, 'limit':20, 'id':''}

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	_Data.id = view.extras.id;
	
	setTimeout(init, 1000);
});

function init () {
	plus.nativeUI.showWaiting('加载中...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/Property/notice_view'),
		'data'     : _Data
	})
	.fail(function (res) {
		console.log('取得公告详情失败：' + JSON.stringify(res));
		app.error('取得公告详情失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('公告详情：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('#pnl-notice').html(template('tpl-notice', res));
		$('#pnl-comment').html(template('tpl-comment', res));
	})
	;
}

// 提交评论
$('.btn-submit').on('tap', function () {
	var dom = this;
	
	plus.nativeUI.showWaiting('加载中...');
	$(dom).prop('disabled', true);
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/Property/notice_view'),
		'data'     : {
			'key'        : app.store('key'), 
			'comment_id' : $('#omment').val(),
			'uid'        : $('#uid').val(),
			'content'    : $('#text').val(),
			'notice_id'  : _Data.id, 
		}
	})
	.fail(function (res) {
		console.log('发表评论失败：' + JSON.stringify(res));
		app.error('发表评论失败');
		plus.nativeUI.closeWaiting();
		$(dom).prop('disabled', false);
	})
	.done(function (res) {
		console.log('评论结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		$(dom).prop('disabled', false);
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('#omment, #text').val('');
	})
	;
});




