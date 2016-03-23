mui.init({
	subpages: [{
		url    : 'convenient.scroll.html',
		id     : 'convenient.scroll.html',
		styles : {top: '44px'}
	}]
});

// 显示拼车类型
$('.mui-icon-compose').on('tap', function () {
	plus.webview.getWebviewById('convenient.scroll.html').evalJS('toggleCarpoolType()');
});
