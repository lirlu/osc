
mui.init({
	subpages: [
		{
			url    : 'shoper.category.html',
			id     : 'shoper.category.html',
			styles : {top: '86px'}
		},
		{
			url    : 'shoper.scroll.html',
			id     : 'shoper.scroll.html',
			styles : {top: '86px', }
		},
	]
});

// 切换显示类型
$('[data-page]').on('tap', function () {
	$(this).removeClass('activet').addClass('activet').siblings().removeClass('activet');
	var page = $(this).attr('data-page');
	plus.webview.getWebviewById(page).show();
});