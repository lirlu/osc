mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	var data = view.extras;
	
	mui.init({
		subpages : [{
			'url'    : data.url,
			'id'     : data.url,
			'styles' : {'top':'45px', 'bottom':'0px'}
		}]
	});
	
	$('#title').text(data.name || ' ');
});