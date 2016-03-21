mui.init();

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	var data = view.extras;
});

$('.bad>.bad').on('tap', function () {
	var v = $('#note-text').val();
	$('#note-text').val(v + (v?',':'') + $(this).text());
});
$('.btn-submit').on('tap', function () {
	plus.webview.currentWebview().close();
	var text = $('#note-text').val();
	plus.webview.getWebviewById('checkout.html').evalJS('doLeaveNote("'+text+'")');
});
