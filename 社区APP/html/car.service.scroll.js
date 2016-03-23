var data = {'type':'', 'page':0, 'limit':15, 'key':app.store('key'), 'type':'cart', 'cate_id':'', 'lat':'', 'lng':''}
// 本社区
function next (cb) {
	console.log('请求数据：' + JSON.stringify(data));
	
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/index/automobile_seller'),
		'data'     : data
	})
	.fail(function (res) {
		console.log('获取汽车服务列表失败：' + JSON.stringify(res));
		app.error('获取汽车服务列表失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('获取汽车服务列表：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		data.page++;
		cb && cb(res);
	})
	;
}

function funcPullupRefresh () {
	next(function (res) {
		var noMore = data.page * data.limit >= (res.total||1);
		$('#pnl-shop').append(template('tpl-shop', res));
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(noMore);//参数为true代表没有更多数据了。
	});
}

mui.init({
	pullRefresh   : {
		container : "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		up        : {
			//contentdown    : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			//contentover    : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			callback       : funcPullupRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		}
	}
});

mui.plusReady(function() {
	setTimeout(function () {
		console.log('sadfasdf');
		mui('#refreshContainer').pullRefresh().pullupLoading();
	},1000);
});

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
		'url'      : app.url('mobile/index/automobile_seller'),
		'data'     : {'key':data.key}
	})
	.fail(function (res) {
		console.log('获取全部分类失败：' + JSON.stringify(res));
		app.error('获取全部分类失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('获取全部分类：' + JSON.stringify(res));
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
		'shop_name' : $(this).attr('shop_name'),
		'addr'      : $(this).attr('addr'),
		'tel'       : $(this).attr('tel'),
	};
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


