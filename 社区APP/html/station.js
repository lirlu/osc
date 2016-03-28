mui.init({
	subpages: [
		{
			url    : 'station.category.html',
			id     : 'station.category.html',
			styles : {top: '90px'}
		},
		{
			url    : 'station.shop.scroll.html',
			id     : 'station.shop.scroll.html',
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