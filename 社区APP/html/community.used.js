var _Data = {};

$('header img').on('tap', function () {
	$('.classify').slideToggle('fast');
});

// 选择不同的分类
$('.classify>ul>li').on('tap', function () {
	var dom = this;
	$(this).removeClass('active').addClass('active').siblings().removeClass('active');
});
