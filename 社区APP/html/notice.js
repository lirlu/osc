var _Data = {'key':app.store('key'), 'page':0, 'limit':0}

function next () {
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/Property/tice_list'),
		'data'     : _Data
	})
	.fail(function (res) {
		console.log('取得小区公告失败：' + JSON.stringify(res));
		app.error('取得小区公告失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('小区公告：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		_Data.page++;
		cb && cb(res);
	})
	;
}
