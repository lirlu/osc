// 数量加减
$('#pnl-product').delegate('.float-r .add', 'tap', function(){
	var max = $(this).closest('.product').attr('data-max') * 1;
	var num = $(this).siblings('.number').text();
	if(num < max){
		num++;
		num = $(this).siblings('.number').text(num);
	} else {
		plus.nativeUI.toast('一次兑换最多只能兑 '+max+' 份');
	}
});
$('#pnl-product').delegate('.float-r .distance', 'tap', function(){
	var num = $(this).siblings('.number').text();
	if(num > 1){
		num--;
		num = $(this).siblings('.number').text(num);
	}
});
// 选择收货地址
$('.btn-pick-addr').on('tap', function () {
	app.open('select.address.html');
});
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
function doSetAddress (item) {
	
	$('[name=addr]').val(item.id);
	$('span.name').text('姓名：' + item.name);
	$('span.mobile').text('电话：' + item.tel);
	$('span.addr').text('地址：' + area(item.provice, item.city, item.state) +' '+ item.addr);
}

template.helper('image', function (v) {
	return app.link.image + v;
});

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	var data = view.extras, key = app.store('key');
	
	plus.nativeUI.showWaiting('请稍后...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/IntegralGoods/exchange_view'),
		'data'     : { 'key':key, 'shop_id':data.shop_id, 'goods_id':data.goods_id }
	})
	.fail(function (res) {
		app.log('取得商品详情失败：' + JSON.stringify(res));
		app.error('取得商品详情失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('取得商品详情：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		if (res.addr_view) { doSetAddress(res.addr_view); }
		$('#pnl-product').append(template('tpl-product', {data:[res.info]}));
		$('.btn-submit').prop('disabled', false);
	})
	;
});
// 提交兑换
$('.btn-submit').on('tap', function () {
	var view = plus.webview.currentWebview();
	var data = view.extras, key = app.store('key');
	
	var data = {
		'key'      : key,
		'addr_id'  : $('[name=addr]').val(),
		'products' : [],
	};
	$('#pnl-product .product').each(function (idx, item) {
		data.products.push({
			'shop_id'  : $(item).attr('data-shop'),
			'goods_id' : $(item).attr('data-product'),
			'num'      : $(item).find('.number').text(),
		});
	});
	data.shop_id  = data.products[0].shop_id;
	data.goods_id = data.products[0].goods_id;
	data.num      = data.products[0].num;
	
	app.log('兑换数据：' + JSON.stringify(data));
	plus.nativeUI.showWaiting('正在兑换...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/IntegralGoods/exchange'),
		'data'     : data
	})
	.fail(function (res) {
		app.log('取得商品详情失败：' + JSON.stringify(res));
		app.error('取得商品详情失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('取得商品详情：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		plus.nativeUI.alert('兑换成功', function () { success(res); });
	})
	;
});

function success (res) {
	try {
		plus.webview.getWebviewById('store.html').evalJS('doSilenceRefresh()');
	} catch (e) {}
	try {
		plus.webview.getWebviewById('purse.html').evalJS('refresh()');
	} catch (e) {}
	
	plus.webview.currentWebview().close();
}




