mui.plusReady(function () {
	var now = new Date();
	$('.now-day').text(now.getMonth() + 1 + '月' + now.getDate() + '日');
	$('.now-year').html(now.getYear() + '<p>今日</p>')
	
	var days = new Date(now.getYear(), now.getMonth() + 1, 0).getDate();
	var from = new Date(now.getYear(), now.getMonth(), 1).getDay();
	var i = 0;
	
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/sign_day'),
		'data'     : {'key':app.store('key')}
	})
	.fail(function (res) {
		console.log('取得签到数据失败：' + JSON.stringify(res));
		app.error('取得签到数据失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('签到数据：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
	})
	;
	console.log(now.getMonth() + 1);
	console.log(new Date(now.getYear(), now.getMonth() + 1, 0).getMonth());
	console.log(days)
	$('.calendar table>tbody td').each(function (idx, dom) {
		if (idx >= from && i < days) {
			$(dom).html('<span>'+ (++i) +'</span>');
			if (i == now.getDate()) { $(dom).addClass('checked round'); }
		}
	});
});


// 用户签到
$('.btn-sigin').on('tap', function () {
	var key = app.store('key');
	if (!key) { plus.nativeUI.toast('请先登录!'); return; }
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/qiandao'),
		'data'     : {'key':key }
	})
	.fail(function (res) {
		console.log('签到失败：' + JSON.stringify(res));
		app.error('签到失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('签到结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
	})
	;
});