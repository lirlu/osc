var cache = [], extras = '';

mui.init();

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	extras = view.extras;
	
	refresh();
});

function refresh () {
	var key  = localStorage.getItem('key');
	
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/addr_list'),
		'data'     : {'key':key}
	})
	.fail(function (res) {
		console.log('获取收货地址列表失败：' + JSON.stringify(res));
		app.error('获取收货地址列表失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('获取收货地址列表：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		cache = res.addr_list;
		$('#pnl-address').empty().append(template('tpl-address', res));
	})
	;
}
template.helper('$checked', function (v) {
	return extras.select == v ? 'checked="checked"' : '';
});
template.helper('$area', function (pro, city, ctr) {
	var a, b, c;
	
	for (var i in cityData3) {
		var item = cityData3[i];
		if (item.value == pro) {
			a = item;
			break;
		}
	}
	a = a ? a : {'text':'', 'children':[]};
	
	for (var i in a.children) {
		var item = a.children[i];
		if (item.value == city) {
			b = item;
			break;
		}
	}
	b = b ? b : {'text':'', 'children':[]};
	
	for (var i in b.children) {
		var item = b.children[i];
		if (item.value == ctr) {
			c = item;
			break;
		}
	}
	c = c ? c : {'text':'', 'children':[]};
	
	return (a.text +' '+ b.text +' '+ c.text);
});