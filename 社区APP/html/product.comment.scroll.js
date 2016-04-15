var _Data = {'lat':'', 'lng':'', 'key':app.store('key'), 'page':0, 'limit':20, 'category':''};
mui.init();

function next (cb) {
	app.log('查询数据：' + JSON.stringify(_Data));
	//plus.nativeUI.showWaiting('加载中...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/goods/evaluate_list'),
		'data'     : mui.extend({}, _Data, {'page':_Data.page+1})
	})
	.fail(function (res) {
		app.log('取得商品评论失败：' + JSON.stringify(res));
		app.error('取得商品评论失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('商品评论：' + JSON.stringify(res));
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
	//app.log('重新刷新页面' + JSON.stringify(_Data));
	$('#pnl-appraise').empty();
	plus.nativeUI.showWaiting('正在刷新...');
	
	next(function (res) {
		plus.nativeUI.closeWaiting();
		$('#pnl-appraise').html(template('tpl-appraise', res));
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();//参数为true代表没有更多数据了。
	});
}
function funcPullupRefresh () {
	next(function (res) {
		var noMore = _Data.page * _Data.limit >= (res.total||1);
		
		if (_Data.page == 1) {
			$('#pnl-appraise').html(template('tpl-appraise', res));
		} else {
			$('#pnl-appraise').append(template('tpl-appraise', res));
		}
		
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(noMore);//参数为true代表没有更多数据了。
	});
}

var forum = {};
forum.prepend = function (data) {
	
};

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

function init (data) {
	var extras = plus.webview.currentWebview().extras || {};
	_Data.shop_id  = extras.shop_id;
	_Data.goods_id = extras.goods_id;
	
	$('#pnl-shop').empty();
	mui('#refreshContainer').pullRefresh().pullupLoading();
}

mui.plusReady(function () {
	setTimeout(init, 200);
});

// 收藏帖子
$('body').delegate('.go-product', 'tap', function() {
	var dom = $(this).closest('.product');
	var data = {
		'goods_id' : $(dom).attr('data-product'),
		'shop_id'  : $(dom).attr('data-shop'),
	};
	//app.open('goods.detail.html', data);
});

template.helper('image', function (v) {
	return app.link.image + v;
});

template.helper('avatar', function (v) {
	return v ? (app.link.image + v) : '../img/iconfont-morentouxiang.png';
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
