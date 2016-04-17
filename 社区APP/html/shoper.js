
mui.init({
	subpages: [
		{
			url    : 'shoper.category.html',
			id     : 'shoper.category.html',
			styles : {top: '45px', 'bottom':'0px'},
			show   : {autoShow:false},
		},
		{
			url    : 'shoper.scroll.html',
			id     : 'shoper.scroll.html',
			styles : {top: '45px', 'bottom':'0px'},
			show   : {autoShow:true},
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