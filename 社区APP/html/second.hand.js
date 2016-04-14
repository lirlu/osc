mui.init({
	subpages : [{
		'url'    : 'second.hand.scroll.html',
		'id'     : 'second.hand.scroll.html',
		'styles' : {
			'top'    : '45px',
			'bottom' : '0px'
		}
	}]
})

$('header img.btn-category').on('tap', function () {
	//$('.classify').slideToggle('fast');
	plus.webview.getWebviewById('second.hand.scroll.html').evalJS('toggle_category()');
});
$('header img.btn-publish').on('tap', function () {
	app.open('second.hand.publish.html');
});