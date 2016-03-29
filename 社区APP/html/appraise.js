mui.init({
	subpages: [
		{
			url    : 'appraise.todo.html',
			id     : 'appraise.todo.html',
			styles : {top: '90px'}
		},
		{
			url    : 'appraise.done.html',
			id     : 'appraise.done.html',
			styles : {top: '90px'}
		},
	]
});

// 切换显示类型
$('[data-page]').on('tap', function () {
	$(this).removeClass('active').addClass('active').siblings().removeClass('active');
	var page = $(this).attr('data-page');
	plus.webview.getWebviewById(page).show();
});