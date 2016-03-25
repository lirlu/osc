var _Data = {'key':app.store('key'), 'page':0, 'limit':9999, 'shop_id':'', 'goods_id':''};
mui.init();

function next (cb) {
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/goods/appraise'),
		'data'     : mui.extend({}, _Data, {'page':_Data.page+1}),
	})
	.fail(function (res) {
		console.log('取得评论失败：' + JSON.stringify(res));
		app.error('取得评论失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		//console.log('商品评论：' + JSON.stringify(res));
		plus.nativeUI.toast('已成功加入购物车');
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
	next(function (res) {
		$('#pnl-appraise').append(template('tpl-appraise', res));
		
		//var noMore = data.page * data.limit >= (res.total||1);
		//mui('#refreshContainer').pullRefresh().endPullupToRefresh(noMore);//参数为true代表没有更多数据了。
	});
});
	
	

