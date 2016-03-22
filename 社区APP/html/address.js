var picker = new mui.PopPicker({layer: 3});
picker.setData(cityData3);

var mask = mui.createMask();

function area (pro, city, ctr) {
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
};

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	var data = view.extras;
	// 修改收货地址	
	if (data.id) {
		plus.nativeUI.showWaiting();
		var key  = localStorage.getItem('key');
		
		$.ajax({
			'dataType' : 'json',
			'type'     : 'post',
			'url'      : app.url('mobile/userinfo/addr_edit'),
			'data'     : {'key':key, 'id':data.id}
		})
		.fail(function (res) {
			console.log('取得收货地址失败：' + JSON.stringify(res));
			app.error('取得收货地址失败');
			plus.nativeUI.closeWaiting();
		})
		.done(function (res) {
			console.log('取得收货地址：' + JSON.stringify(res));
			plus.nativeUI.closeWaiting();
			
			if (res.error && res.error.msg) { app.error(res.error.msg); return; }
			if (false == res.status) {app.error(res.msg); return;};
			if (res.msg) { plus.nativeUI.toast(res.msg); };
			
			$('[name=id]').val(res.addr_info.id);
			$('[name=name]').val(res.addr_info.name);
			$('[name=tel]').val(res.addr_info.tel);
			$('[name=provice]').val(res.addr_info.provice);
			$('[name=city]').val(res.addr_info.city);
			$('[name=state]').val(res.addr_info.state);
			$('[name=addr]').val(res.addr_info.addr);
			
			$('.btn-area .deji').text(area(res.addr_info.provice, res.addr_info.city, res.addr_info.state));
		})
		;
		
	}
});

$('.btn-submit').on('tap', function () {
	var key  = localStorage.getItem('key');
	var data = {
		'key'     : key,
		'id'      : $('[name=id]').val(),
		'name'    : $('[name=name]').val(),
		'tel'     : $('[name=tel]').val(),
		'provice' : $('[name=provice]').val(),
		'city'    : $('[name=city]').val(),
		'state'   : $('[name=state]').val(),
		'addr'    : $('[name=addr]').val(),
	};
	plus.nativeUI.showWaiting();
	console.log('收货地址数据：' + JSON.stringify(data));
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/addr_add'),
		'data'     : data
	})
	.fail(function (res) {
		console.log('保存收货地址失败：' + JSON.stringify(res));
		app.error('保存收货地址失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('修改商品数量结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		plus.webview.getWebviewById('goods.address.html').evalJS('refresh()');
		plus.webview.currentWebview().close();
	})
	;
});

$('.btn-area').on('tap', function(event) {
	picker.show(function(items) {
		$('.btn-area .deji').html((items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text);
		
		$('[name=provice]').val((items[0] || {}).value);
		$('[name=city]').val((items[1]    || {}).value);
		$('[name=state]').val((items[2]   || {}).value);
		//返回 false 可以阻止选择框的关闭
		//return false;
	});
});
