mui.init({
	subpages: [
		{
			url    : 'my.order.scroll.all.html',
			id     : 'my.order.scroll.all.html',
			styles : {top: '90px'}
		},
		{
			url    : 'my.order.scroll.unpay.html',
			id     : 'my.order.scroll.unpay.html',
			styles : {top: '90px'}
		},
		{
			url    : 'my.order.scroll.undelivered.html',
			id     : 'my.order.scroll.undelivered.html',
			styles : {top: '90px'}
		},
		{
			url    : 'my.order.scroll.delivering.html',
			id     : 'my.order.scroll.delivering.html',
			styles : {top: '90px'}
		},
		{
			url    : 'my.order.scroll.delivered.html',
			id     : 'my.order.scroll.delivered.html',
			styles : {top: '90px'}
		},
	]
});

// 切换显示类型
$('[data-page]').on('tap', function () {
	$(this).removeClass('active').addClass('active').siblings().removeClass('active');
	var page = $(this).attr('data-page');
	plus.webview.getWebviewById(page).show();
});