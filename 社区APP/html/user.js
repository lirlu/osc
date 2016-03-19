$('body').delegate('[data-url]', 'tap', function () {
	app.open($(this).attr('data-url'));
});

function refresh () {
	console.log('刷新用户数据');
}
