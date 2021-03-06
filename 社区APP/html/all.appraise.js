var _Data = {'key':app.store('key'), 'page':0, 'limit':9999, 'shop_id':'', 'goods_id':''};
mui.init();

function next (cb) {
	app.log('查看评论：' + JSON.stringify(_Data));
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/goods/evaluate_list'),
		'data'     : mui.extend({}, _Data, {'page':_Data.page+1}),
	})
	.fail(function (res) {
		app.log('取得评论失败：' + JSON.stringify(res));
		app.error('取得评论失败');
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

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	_Data.shop_id  = view.extras.shop_id;
	_Data.goods_id = view.extras.goods_id;
	
	next(function (res) {
		$('#pnl-appraise').append(template('tpl-appraise', res));
		
		//var noMore = data.page * data.limit >= (res.total||1);
		//mui('#refreshContainer').pullRefresh().endPullupToRefresh(noMore);//参数为true代表没有更多数据了。
	});
});

template.helper('avatar', function (v) {
	return v ? (app.link.image + v) : '../img/iconfont-morentouxiang.png';
});


