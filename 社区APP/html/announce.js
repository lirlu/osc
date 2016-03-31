
$('.btn-submit').on('tap', function () {
	var dom = this;
	var data = {
		'key'       : app.store('key'),         // 登录用户KEY
		'day'       : $('[name="day"]').val(),  // 出发日期
		'time'      : $('[name="time"]').val(), // 出发时间
		
		'content'   : $('[name="title"]').val(),// 内容
		'type'      : $('[name="type"]').val(), // 类型
		'set_out'   : $('[name="day"]').val() + ' ' + $('[name="time"]').val(),// 出发时间
		'num'       : $('[name="num"]').val(),  // 人数
		'addr'      : $('[name="to"]').val(),   // 到达地址
		'set_addr'  : $('[name="from"]').val(), // 出发地址
		'mobile'    : $('[name="mobile"').val(),// 联系方式
	}
	
	plus.nativeUI.showWaiting('正在提交...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/pingche'),
		'data'     : data
	})
	.fail(function (res) {
		console.log('发布拼车失败：' + JSON.stringify(res));
		app.error('发布拼车失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('发布拼车：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		plus.webview.getWebviewById('convenient.carpool.scroll.html').evalJS('init()');
		setTimeout(function () {
			plus.webview.currentWebview().close();
		}, 500);
	})
	;
});

$('[name=type]').on('change', function () {
	var type = $(this).val();
	$('[name=num').prev().text('1'==type ? '可带几人' : '同行几人');
});


