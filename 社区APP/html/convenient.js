mui.init({
	subpages: [
		{
			url    : 'convenient.category.scroll.html',
			id     : 'convenient.category.scroll.html',
			styles : {top: '90px'},
			show   : {autoShow:false},
		},
		{
			url    : 'convenient.carpool.scroll.html',
			id     : 'convenient.carpool.scroll.html',
			styles : {top: '90px'},
			show   : {autoShow:false},
		},
		{
			url    : 'convenient.local.scroll.html',
			id     : 'convenient.local.scroll.html',
			styles : {top: '90px'},
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

$('.btn-show-type').on('tap', function () {
	// 显示拼车类型选择
	var view = plus.webview.getWebviewById('convenient.carpool.scroll.html');
	var tab = $('[data-page="convenient.carpool.scroll.html"]');
	if (!$(tab).hasClass('activet')) {
		$('[data-page="convenient.carpool.scroll.html"]').trigger('tap');
	}
	
	view.evalJS("toggleCarpoolType()");
});

$('.btn-publish').on('tap', function () {
	if (!app.store('key')) {
		plus.nativeUI.toast('发布拼车信息需要先登录');
	} else {
		app.open('announce.html');
	}
});



