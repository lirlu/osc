mui.init({
	subpages: [
		{
			url    : 'forum.scroll.html',
			id     : 'forum.scroll.html',
			styles : {top: '45px', bottom: '45px'}
		},
	]
});
// 发布帖子
$('body').delegate('.btn-publish', 'tap', function() {
	app.open('forum.publish.html');
});