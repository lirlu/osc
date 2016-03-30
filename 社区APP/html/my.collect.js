mui.init({
	subpages: [
		{
			url    : 'my.collect.product.html',
			id     : 'my.collect.product.html',
			styles : {top: '84px'}
		},
		{
			url    : 'my.collect.shop.html',
			id     : 'my.collect.shop.html',
			styles : {top: '84px'}
		},
	]
});

// 切换显示类型
$('[data-page]').on('tap', function () {
	$(this).removeClass('activet').addClass('activet').siblings().removeClass('activet');
	var page = $(this).attr('data-page');
	plus.webview.getWebviewById(page).show();
});