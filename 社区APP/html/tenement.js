// 普通页面跳转
$('body').delegate("[data-url]", 'tap', function() {
	app.open($(this).attr('data-url'));
});