mui.init({
	subpages: [
		{
			url    : 'wash.clothes.category.html',
			id     : 'wash.clothes.category.html',
			styles : {top: '90px'},
			show   : {autoShow:false},
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
	$(this).siblings('[data-page]').each(function (idx, item) {
		try {plus.webview.getWebviewById($(item).attr('data-page')).hide();} catch (e) {}
	});
	plus.webview.getWebviewById(page).show();
});