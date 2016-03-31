mui.init({
	subpages: [
		{
			url    : 'find.shop.scroll.html',
			id     : 'find.shop.scroll.html',
			styles : {top: '50px'}
		},
	]
});

$('[name="keyword"]').on('search', function (e) {
	var keyword = $(this).val();
	if (!keyword) { plus.nativeUI.toast('请输入搜索关键字'); return; }
	plus.webview.getWebviewById('find.shop.scroll.html').evalJS('init({keyword:"'+keyword+'"})');
});
