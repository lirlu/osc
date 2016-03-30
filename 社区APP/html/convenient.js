mui.init({
	subpages: [
		{
			url    : 'convenient.category.scroll.html',
			id     : 'convenient.category.scroll.html',
			styles : {top: '90px'}
		},
		{
			url    : 'convenient.carpool.scroll.html',
			id     : 'convenient.carpool.scroll.html',
			styles : {top: '90px'}
		},
		{
			url    : 'convenient.local.scroll.html',
			id     : 'convenient.local.scroll.html',
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