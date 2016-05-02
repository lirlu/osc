var _Data = {'type':'', 'page':0, 'limit':15, 'key':app.store('key'), 'cate_id':'', 'lat':'', 'lng':''}
// 本社区
function next (cb) {
	app.log('请求数据：' + JSON.stringify(_Data));
	
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/index/union_seller'),
		'data'     : mui.extend({}, _Data, {'page':_Data.page+1})
	})
	.fail(function (res) {
		app.log('获取联盟商家列表失败：' + JSON.stringify(res));
		app.error('获取联盟商家列表失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('获取联盟商家列表：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		_Data.page++;
		cb && cb(res);
	})
	;
}

function funcPulldownRefresh () {
	_Data.page = 0;
	app.log('重新刷新页面' + JSON.stringify(_Data));
	$('#pnl-shop').empty();
	plus.nativeUI.showWaiting('正在刷新...');
	
	next(function (res) {
		plus.nativeUI.closeWaiting();
		$('#pnl-shop').html(template('tpl-shop', res));
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();//参数为true代表没有更多数据了。
	});
}
function funcPullupRefresh () {
	next(function (res) {
		var noMore = _Data.page * _Data.limit >= (res.total||1);
		$('#pnl-shop').append(template('tpl-shop', res));
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(noMore);//参数为true代表没有更多数据了。
	});
}

mui.init({
	pullRefresh   : {
		container : "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		down      : {
			contentdown    : "下拉可重新加载",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			contentover    : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			callback       : funcPulldownRefresh,
		},
		up        : {
			//contentdown    : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			//contentover    : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			callback       : funcPullupRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		}
	}
});

mui.plusReady(function() {
	app.locate(function(res) {
		_Data.lat = res.coords.latitude;
		_Data.lng = res.coords.longitude;
		
		mui('#refreshContainer').pullRefresh().pullupLoading();
	}, {
		provider: 'baidu'
	});
});

function init (data) {
	data = data || {};
	_Data.page    = 0;
	_Data.cate_id = data.category || '';
	
	$('#pnl-shop').html('');
	mui('#refreshContainer').pullRefresh().pullupLoading();
}

template.helper('image', function (v) {
	return app.link.image + v;
});

// 选择本社区
$('.btn-local-shop').on('tap', function () {
	$('#pnl-shop').empty();
	mui('#refreshContainer').pullRefresh().pullupLoading();
});

// 选择全部分类
$('.btn-all-category').on('tap', function () {
	$('#pnl-shop').empty();
	
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/cateseller/union_seller_cate'),
		'data'     : {'key':_Data.key}
	})
	.fail(function (res) {
		app.log('获取全部分类失败：' + JSON.stringify(res));
		app.error('获取全部分类失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('获取全部分类：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('#pnl-shop').append(template('tpl-category', res));
		
		//分类第一项显示
		$('.right-div .namme').hide();
		$('.right-div ul').eq(0).show();
		$('.left-div:first').find('li').addClass('active1').css('background', '#eee');
	})
	;
});

// 点击商家列表
$('#pnl-shop').delegate('.shop', 'tap', function() {
	var data = {
		'shop_id'   : $(this).attr('shop_id'),
		'shop_name' : $(this).attr('data-name'),
		'addr'      : $(this).attr('addr'),
		'tel'       : $(this).attr('tel'),
		'type'      : $(this).attr('data-type'),
	};
	/*
	if ('0' == data.type) {
		app.open('shop.detail1.html', data);
	} else {
		app.open('shop.information.html', data);
	}
	*/
	app.open('shop.detail1.html', data);
});

$('.contol .appraise1').on('tap', function () {
	$(this).removeClass('activet').addClass('activet').siblings().removeClass('activet');
});

//点击一级列表
$('body').delegate('.left-div', 'tap', function() {
	$(this).find('li').addClass('active1').css('background', '#eee');
	$(this).siblings().find('li').removeClass('active1').css('background', '');

	$('[data-name=' + $(this).attr('data-str') + ']').find('ul').css('display', 'block');
	$('[data-name=' + $(this).attr('data-str') + ']').siblings('.right-div').find('ul').css('display', 'none');
});

//点击二级列表
$('body').delegate('.right-div li', 'tap', function() {

	$(this).addClass('active1').siblings('li').removeClass('active1');
	$('div.appraise1').eq(0).addClass('activet').siblings().removeClass('activet');
	
	data.page    = 1;
	data.cate_id = $(this).attr('data-name');
	
	$('#pnl-shop').empty();
	mui('#refreshContainer').pullRefresh().pullupLoading();
});


