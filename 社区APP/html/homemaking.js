mui.init({
	subpages: [
		{
			url    : 'homemaking.category.html',
			id     : 'homemaking.category.html',
			styles : {top: '90px'}
		},
		{
			url    : 'homemaking.shop.scroll.html',
			id     : 'homemaking.shop.scroll.html',
			styles : {top: '90px'}
		},
	]
});

// 切换显示类型
$('[data-page]').on('tap', function () {
	$(this).removeClass('activet').addClass('activet').siblings().removeClass('activet');
	var page = $(this).attr('data-page');
	plus.webview.getWebviewById(page).show();
});