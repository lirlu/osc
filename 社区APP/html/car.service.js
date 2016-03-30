mui.init({
	subpages: [
		{
			url    : 'car.service.category.html',
			id     : 'car.service.category.html',
			styles : {top: '90px'}
		},
		{
			url    : 'car.service.scroll.html',
			id     : 'car.service.scroll.html',
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