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
		if (1 == 1) {
			plus.nativeUI.toast('不能选择今天以前的时间');
			return false;
		}
		picker.dispose();
	});
});
// 点击留言
$('.btn-leave-note').on('tap', function () {
	app.open('remark.html');
});
function doLeaveNote (text) {
	
}
