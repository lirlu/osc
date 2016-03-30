mui.init({
	subpages: [
		{
			url    : 'my.publish.used.html',
			id     : 'my.publish.used.html',
			styles : {top: '90px'}
		},
		{
			url    : 'my.publish.article.html',
			id     : 'my.publish.article.html',
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