mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	
	$.ajax({
		'dataType' : 'json',
		'type'     : 'get',
		'url'      : app.url('mobile/viewseller/seller_view'),
		'data'     : {'shop_id':view.extras.id}
	})
	.fail(function (res) {
		console.log('取得商家详情失败：' + JSON.stringify(res));
	})
	.done(function (res) {
		console.log('商家详情：' + JSON.stringify(res));
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		var data = res.seller_view;
		
		$('.shop_name').append($('<span></span>').text(data.shop_name || ''));
		$('.business_time').append($('<span></span>').text(data.business_time || ''));
		$('.addr').append($('<span></span>').text(data.addr || ''));
		$('.tel').append($('<span></span>').text(data.tel || ''));
		$('.desc').append($('<span></span>').text(data.details || ''));
	})
	;
});

// 点击电话联系商家
$('body').delegate('.tel span', 'tap', function () {
	var tel = $(this).text();
	if (tel) { plus.device.dial(tel, true); }
});


