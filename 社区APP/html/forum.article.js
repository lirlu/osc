mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	
	mui.init({
		subpages: [
			{
				url    : 'forum.article.comment.scroll.html',
				id     : 'forum.article.comment.scroll.html',
				styles : {top: '45px'},
				extras : {extras:view.extras}
			},
		]
	});
});