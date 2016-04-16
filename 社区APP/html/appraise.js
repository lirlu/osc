mui.init({
	subpages: [
		{
			url    : 'appraise.todo.html',
			id     : 'appraise.todo.html',
			styles : {top: '90px'},
			show   : {autoShow:false},
		},
		{
			url    : 'appraise.done.html',
			id     : 'appraise.done.html',
			styles : {top: '90px'},
			show   : {autoShow:true},
		},
	]
});

// 切换显示类型
$('[data-page]').on('tap', function () {
	$(this).removeClass('active').addClass('active').siblings().removeClass('active');
	var page = $(this).attr('data-page');
	$(this).siblings('[data-page]').each(function (idx, item) {
		try {plus.webview.getWebviewById($(item).attr('data-page')).hide();} catch (e) {}
	});
	plus.webview.getWebviewById(page).show();
});