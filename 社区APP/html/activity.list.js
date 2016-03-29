mui.init({
	subpages: [
		{
			url    : 'activity.list.scroll.html',
			id     : 'activity.list.scroll.html',
			styles : {top: '45px'}
		},
	]
});

// 点击发布按钮
$('.btn-publish').on('tap', function () {
	app.open('activity.publish.html');
});
