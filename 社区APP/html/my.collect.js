mui.init({
	subpages: [
		{
			url    : 'my.collect.product.html',
			id     : 'my.collect.product.html',
			styles : {top: '84px'},
			show   : {autoShow:false},
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
	$(this).siblings('[data-page]').each(function (idx, item) {
		try {plus.webview.getWebviewById($(item).attr('data-page')).hide();} catch (e) {}
	});
	plus.webview.getWebviewById(page).show();
});

setTimeout(function () { $('[data-page]').first().trigger('tap');  }, 1000);