mui.init();

template.helper('image', function (v) {
	return app.link.image + v;
});
template.helper('price', function (v) {
	return parseInt(v, 10) / 100;
});

mui.plusReady(refresh);
function refresh () {
	var view = plus.webview.currentWebview();
	var data = view.extras;
	if (!data.selected || 0 == data.selected.length) {
		alert('请至少选择一个商品再结算');
		plus.webview.currentWebview().close();
		return;
	}
	
	var key = localStorage.getItem('key');
	//console.log('结算请求：' + JSON.stringify({'key':key, 'cart':data.selected}));
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/order/order_checkout'),
		'data'     : {'key':key, 'cart':data.selected}
	})
	.fail(function (res) {
		console.log('结算初始化失败：' + JSON.stringify(res));
		app.error('结算初始化失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('结算数据：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		$('#pnl-product').append(template('tpl-product', res));
	})
	;
}
// 选择收货地址
$('section.address li').on('tap', function () {
	app.open('select.address.html', {'select':$('[name=delivery-addr]').val()});
});
function doSetAddress (item) {
	console.log('选择收货地址：' + JSON.stringify(item));
	
	$('section.address li input').val(item.id);
	$('section.address li span.human').text(item.name + ' ' + item.tel);
	$('section.address li span.addr').text(area(item.provice, item.city, item.state) +' '+ item.addr);
}
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
// 选择送货时间
$('.btn-choose-time').on('tap', function () {
	var options = {
		"type"       : "hour",
		"customData" : {
			"h":[
				{"text":"上午","value":"上午"},
				{"text":"下午","value":"下午"},
				{"text":"晚上","value":"晚上"}
			]
		},
		"labels"     :["年", "月", "日", "时段", "分"]
	};

	var picker = new mui.DtPicker(options);
	picker.show(function(res) {

		console.log('选择结果: ' + res.text);
		console.log(JSON.stringify(res));
		$('.time-hint').text(res.text);
		if (1 == 1) {
			//plus.nativeUI.toast('不能选择今天以前的时间');
			//return false;
		}
		picker.dispose();
	});
});
$('[name=invoice]').on('change', function () {
	$('.invoice-input-row').toggleClass('mui-hidden');
});
// 点击留言
$('.btn-leave-note').on('tap', function () {
	app.open('remark.html', {'note':$('[name=note-text]').val()});
});
function doLeaveNote (text) {
	//console.log('留言信息：' + text);
	$('.note-hint').text(text);
}
// 提交订单
$('.btn-submit').on('tap', function () {
	var view = plus.webview.currentWebview();
	var key  = localStorage.getItem('key');

	var data = {
		'key'    : key,
		'payway' : $('[name=payway]:checked').val(),
		'cart'   : view.extras.selected,
		'address': $('[name=delivery-addr]').val(),
		'time'   : $('[name=delivery-time]').val(),
		'note'   : $('[name=note-text]').val(),
		'invoice': $('[name=invoice]').is(':checked'),
		'title'  : $('[name=invoice-name]').val(),
	};
	if (!data.address) { alert('请选择收货地址'); return; }
	if (data.invoice && !data.title) { alert('请填写发票抬头'); return; }
	
	plus.nativeUI.showWaiting('正在提交订单...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/order/order_checkout'),
		'data'     : data
	})
	.fail(function (res) {
		console.log('提交订单失败：' + JSON.stringify(res));
		app.error('提交订单失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('提交订单结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
	})
	;
});
