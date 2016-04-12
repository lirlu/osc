mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	
	mui.init({
		subpages: [
			{
				url    : 'product.comment.scroll.html',
				id     : 'product.comment.scroll.html',
				styles : {top: '45px'},
				extras : {extras:view.extras}
			},
		]
	});
});
