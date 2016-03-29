mui.init({
	subpages: [
		{
			url    : 'wash.clothes.category.html',
			id     : 'wash.clothes.category.html',
			styles : {top: '90px'}
		},
		{
			url    : 'wash.clothes.shop.scroll.html',
			id     : 'wash.clothes.shop.scroll.html',
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