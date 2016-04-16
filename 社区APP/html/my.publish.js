mui.init({
	subpages: [
		{
			url    : 'my.publish.used.html',
			id     : 'my.publish.used.html',
			styles : {top: '90px'},
			show   : {autoShow:false},
		},
		{
			url    : 'my.publish.article.html',
			id     : 'my.publish.article.html',
			styles : {top: '90px'},
			show   : {autoShow:false},
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