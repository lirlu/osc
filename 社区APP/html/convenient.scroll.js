var data = {'tab':'', 'page':0, 'limit':15, 'key':app.store('key'), 'cate_id':'', 'lat':'', 'lng':'', 'type':''}
// 本社区
function next (cb) {
	console.log('请求数据：' + JSON.stringify(data));
	var url = 'carpool' == data.tab ? 'mobile/index/pingche' : 'mobile/index/convenient_seller';
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url(url),
		'data'     : data
	})
	.fail(function (res) {
		console.log('获取本社区数据失败：' + JSON.stringify(res));
		app.error('获取本社区数据失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('本社区数据：' + JSON.stringify(res));
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
		
		if ('carpool' == data.tab) {
			$('#pnl-shop').append(template('tpl-carpool', res));// 拼车数据
		} else {
			$('#pnl-shop').append(template('tpl-shop', res));// 本小区数据
		}
		
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
	app.locate(function(res) {
		data.lat = res.coords.latitude;
		data.lng = res.coords.longitude;
		
		mui('#refreshContainer').pullRefresh().pullupLoading();
	}, {
		provider: 'baidu'
	});
});

template.helper('image', function (v) {
	return v ? (app.link.image + v) : '../img/iconfont-morentouxiang.png';
});

function toggleCarpoolType () {
	// 显示拼车类型选择
	$('ul.type').toggleClass('mui-hidden');
}

// 选择本社区
$('.btn-local-shop').on('tap', function () {
	$('#pnl-shop').empty(); data.page = 0;
	mui('#refreshContainer').pullRefresh().pullupLoading();
});

// 选择拼车服务
$('.btn-take-ride').on('tap', function () {
	$('#pnl-shop').empty(); data.page = 0;
	mui('#refreshContainer').pullRefresh().pullupLoading();
});

// 选择全部分类
$('.btn-all-category').on('tap', function () {
	$('#pnl-shop').empty(); data.page = 0;
	
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/cateseller/convenient_seller_cate'),
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
// 点击拼车信息
$('#pnl-shop').delegate('.carpool', 'tap', function() {
	var data = {
		'id'   : $(this).attr('data-id'),
		'type' : $(this).attr('data-type'),
	};
	
	if ('owner' == $(this).attr('data-type')) {
		app.open('publish.owner.html', data);
	} else {
		app.open('publish.passenger.html', data);	
	}
});

$('.contol .appraise1').on('tap', function () {
	data.tab = $(this).attr('data-type');
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


